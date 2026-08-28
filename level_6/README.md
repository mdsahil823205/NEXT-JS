# Next.js — Data Fetching Strategies Guide (SSR, SSG, ISR, CSR)

Yeh Level 6 topics cover karte hain ki Next.js mein data kaise fetch hota hai different rendering strategies ke through. App Router mein yeh sab `fetch()` ke `cache` aur `revalidate` options se control hota hai — koi alag API nahi hoti (Pages Router jaisa `getServerSideProps`/`getStaticProps` nahi).

---

## 1. SSR — Server-Side Rendering

**Kya hai:** Har request pe fresh data fetch hota hai aur page **server pe render** hoke HTML client ko bheja jaata hai. Koi caching nahi hoti.

**Kab use karein:** Jab data **frequently change** hota ho aur har user ko **latest/real-time data** dikhana zaroori ho — jaise dashboard, stock prices, user-specific data.

**Kaam kaise karta hai:** `fetch()` ke andar `{ cache: "no-store" }` pass karke.

```tsx
// app/dashboard/page.tsx
async function getLiveData() {
  const res = await fetch("https://api.example.com/live-stats", {
    cache: "no-store",
  });
  return res.json();
}

export default async function Dashboard() {
  const data = await getLiveData();

  return (
    <div>
      <h1>Live Stats</h1>
      <p>Active Users: {data.activeUsers}</p>
    </div>
  );
}
```

**Important points:**

- Har request pe naya server render hota hai — page kabhi statically cache nahi hota.
- Slower ho sakta hai kyunki har baar server-side computation + data fetch hoti hai.
- SEO ke liye acha hai (fully rendered HTML milta hai) lekin performance ka trade-off hai.
- Dynamic function use karne se (`cookies()`, `headers()`, `searchParams`) bhi automatically route SSR ban jaata hai.

---

## 2. SSG — Static Site Generation

**Kya hai:** Data **build time** pe fetch hota hai aur HTML pre-generate ho jaata hai. Yeh HTML CDN pe serve hota hai — har request pe same static file milti hai.

**Kab use karein:** Jab data **rarely change** hota ho — jaise blog posts, marketing pages, documentation, product catalog jo baar baar update nahi hota.

**Kaam kaise karta hai:** Default `fetch()` behavior hi SSG hai — `cache: "force-cache"` (yeh already default hai App Router mein).

```tsx
// app/blog/page.tsx
async function getBlogPosts() {
  const res = await fetch("https://api.example.com/posts", {
    cache: "force-cache", // default behavior, explicitly likha ja sakta hai
  });
  return res.json();
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <ul>
      {posts.map((post: any) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

**Important points:**

- Sabse **fast** rendering strategy hai kyunki HTML already ready hota hai — seedha CDN se serve hota hai.
- Build time pe hi data fetch ho jaata hai, isliye deploy ke baad naya data automatically nahi aayega (jab tak rebuild na ho).
- Dynamic routes ke liye `generateStaticParams()` use karke build time pe hi saare possible pages pre-render kiye ja sakte hain.

```tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await fetch("https://api.example.com/posts").then((res) =>
    res.json(),
  );

  return posts.map((post: any) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return <h1>{post.title}</h1>;
}
```

---

## 3. ISR — Incremental Static Regeneration

**Kya hai:** SSG aur SSR ka **best of both worlds** — page static generate hota hai, lekin ek specified time interval ke baad **background mein automatically revalidate** (regenerate) ho jaata hai bina full rebuild ke.

**Kab use karein:** Jab data **occasionally change** hota ho — jaise e-commerce product pages, news articles, listings jo hour/day mein update hoti hain lekin real-time nahi chahiye.

**Kaam kaise karta hai:** `fetch()` ke andar `{ next: { revalidate: <seconds> } }` pass karke.

```tsx
// app/products/[id]/page.tsx
async function getProduct(id: string) {
  const res = await fetch(`https://api.example.com/products/${id}`, {
    next: { revalidate: 60 }, // 60 seconds ke baad revalidate hoga
  });
  return res.json();
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  return (
    <div>
      <h1>{product.name}</h1>
      <p>₹{product.price}</p>
    </div>
  );
}
```

**Important points:**

- **Stale-while-revalidate** pattern follow karta hai: pehla user ko cached (stale) version milta hai, background mein naya data fetch hota hai, aur uske baad ke users ko updated version milta hai.
- Full site rebuild ki zaroorat nahi — sirf woh specific page revalidate hota hai.
- **On-demand revalidation** bhi possible hai `revalidatePath()` ya `revalidateTag()` se (jaise CMS mein content update hote hi turant revalidate karna).

```ts
// Server Action ya Route Handler mein
import { revalidatePath } from "next/cache";

export async function updateProduct() {
  // ... update logic
  revalidatePath("/products/123");
}
```

---

## 4. CSR — Client-Side Rendering

**Kya hai:** Data **browser mein**, component mount hone ke baad fetch hota hai — server sirf empty/minimal HTML shell bhejta hai, actual data JavaScript se client-side load hota hai.

**Kab use karein:** Jab data **user-specific**, **frequently interactive**, ya SEO ki zaroorat na ho — jaise user dashboard ke andar ka data, live search suggestions, real-time chat, notifications.

**Kaam kaise karta hai:** Client Component ke andar `useEffect` + `useState`, ya libraries jaise **SWR**/**React Query** use karke.

```tsx
"use client";

import { useState, useEffect } from "react";

export default function UserNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <ul>
      {notifications.map((n: any) => (
        <li key={n.id}>{n.message}</li>
      ))}
    </ul>
  );
}
```

**Better approach with SWR (recommended for CSR):**

```tsx
"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Notifications() {
  const { data, isLoading } = useSWR("/api/notifications", fetcher, {
    refreshInterval: 5000, // har 5 sec mein refresh
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <ul>
      {data.map((n: any) => (
        <li key={n.id}>{n.message}</li>
      ))}
    </ul>
  );
}
```

**Important points:**

- Server component ke andar bhi **partial CSR** ho sakta hai — matlab page ka main content server se aaye, aur ek specific interactive part (jaise notifications) client-side fetch kare.
- SEO ke liye sabse **kam suitable** hai kyunki crawler ko initial HTML mein data nahi milta.
- Loading states manually handle karne padte hain.

---

## Quick Summary Table

| Strategy | Data Fetch Time       | Caching                               | Best For                                  | `fetch()` Config                 |
| -------- | --------------------- | ------------------------------------- | ----------------------------------------- | -------------------------------- |
| **SSR**  | Har request pe        | None                                  | Real-time, user-specific data             | `cache: "no-store"`              |
| **SSG**  | Build time            | Permanent (until rebuild)             | Static content, blogs, docs               | `cache: "force-cache"` (default) |
| **ISR**  | Build time + periodic | Time-based revalidation               | Semi-dynamic content (products, listings) | `next: { revalidate: N }`        |
| **CSR**  | Client mount ke baad  | Browser/client-side (SWR/React Query) | Interactive, user-specific, real-time UI  | `useEffect` / SWR / React Query  |

---

## Decision Flowchart

```
Data kitni frequently change hoti hai?
│
├── Real-time / har request different → SSR (cache: "no-store")
│
├── Kabhi kabhi change hoti hai (mins/hours) → ISR (revalidate: N)
│
├── Bilkul nahi change hoti (build ke time fix) → SSG (default cache)
│
└── User-specific / interactive / SEO ki zaroorat nahi → CSR ("use client" + useEffect/SWR)
```

> App Router mein yeh sab strategies **ek hi `fetch()` API** ke different configurations se achieve hoti hain — Pages Router jaisa `getServerSideProps`, `getStaticProps`, `getStaticPaths` alag se likhne ki zaroorat nahi padti. Server Components mein SSR/SSG/ISR seedha `fetch()` options se control hota hai, aur CSR ke liye Client Component + browser-side data fetching use hoti hai.
