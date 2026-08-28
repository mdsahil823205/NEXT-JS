# Next.js — Server Components & API Routes Guide

Yeh Level 5 topics cover karte hain Server Components ka concept, API route handlers ka folder structure, HTTP methods, dynamic routes aur query parameters handle karna.

---

## 1. Folder Structure (API Routes ke liye)

**Kya hai:** App Router mein API endpoints banane ke liye `app` folder ke andar special `route.ts` file use hoti hai. Folder structure hi URL path decide karta hai.

**Basic structure:**

```
app/
 └── api/
      ├── users/
      │    └── route.ts          → /api/users
      ├── users/
      │    └── [id]/
      │         └── route.ts     → /api/users/:id
      ├── posts/
      │    ├── route.ts          → /api/posts
      │    └── [postId]/
      │         └── comments/
      │              └── route.ts → /api/posts/:postId/comments
```

**Important points:**
- Convention ke hisaab se sab API routes `app/api/` folder ke andar rakhe jaate hain (though technically kahin bhi ho sakte hain jahan `route.ts` ho).
- Har folder ek route segment represent karta hai — jaisa page routing mein hota hai.
- `page.tsx` aur `route.ts` **same folder mein nahi** rakh sakte — conflict error aayega.
- Nested folders se nested API paths banti hain, exactly jaise UI routes banti hain.

---

## 2. Server Components

**Kya hai:** Next.js App Router mein **by default har component Server Component** hota hai — matlab woh server pe render hota hai aur sirf final HTML client ko bheja jaata hai.

**Kaam:** Data fetching, backend logic, database queries, ya sensitive operations (API keys, secrets) seedha component ke andar karna — bina client ko expose kiye.

**Key characteristics:**

| Feature | Server Component | Client Component |
|---|---|---|
| Render location | Server | Browser |
| JS bundle mein include? | Nahi | Haan |
| `useState`, `useEffect` use kar sakta? | Nahi | Haan |
| Direct DB/API access | Haan | Nahi (indirect) |
| Interactivity (onClick, etc.) | Nahi | Haan |
| Default in App Router? | Haan | Nahi (`"use client"` chahiye) |

**Important points:**
- Async component ban sakta hai — seedha `await` use karke data fetch kiya ja sakta hai.
- Client-side JS bundle size kam hota hai kyunki Server Component ka code browser tak nahi jaata.
- SEO-friendly hota hai kyunki fully rendered HTML server se aata hai.
- Sensitive logic (API keys, DB credentials) safe rehte hain kyunki yeh code client ko kabhi expose nahi hota.

```tsx
// app/users/page.tsx (Server Component by default)
async function getUsers() {
  const res = await fetch("https://api.example.com/users", { cache: "no-store" });
  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <ul>
      {users.map((user: any) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

**Client Component kab use karein:** Jab interactivity chahiye — `onClick`, `useState`, `useEffect`, browser APIs (localStorage, window), etc.

```tsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

---

## 3. HTTP Methods (GET, POST, PUT, DELETE)

**Kya hai:** `route.ts` file ke andar tum named exports ke through different HTTP methods handle kar sakte ho. Har method ek async function hota hai jo Web `Request`/`Response` API use karta hai.

**Important points:**
- Function ka naam exactly HTTP method jaisa hona chahiye (uppercase): `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
- Har handler `Request` object receive karta hai aur `Response` (ya `NextResponse`) return karta hai.
- Agar kisi method ko support nahi karte, toh Next.js automatically `405 Method Not Allowed` return kar dega.

```ts
// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";

// GET - saare users fetch karna
export async function GET() {
  const users = await db.user.findMany();
  return NextResponse.json(users);
}

// POST - naya user create karna
export async function POST(request: NextRequest) {
  const body = await request.json();
  const newUser = await db.user.create({ data: body });
  return NextResponse.json(newUser, { status: 201 });
}

// PUT - existing user update karna
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const updatedUser = await db.user.update({
    where: { id: body.id },
    data: body,
  });
  return NextResponse.json(updatedUser);
}

// DELETE - user delete karna
export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  await db.user.delete({ where: { id } });
  return NextResponse.json({ message: "User deleted" });
}
```

---

## 4. Dynamic Route in Server Component

**Kya hai:** Dynamic segments `[paramName]` folder naming convention se banaye jaate hain — yeh URL ke variable parts ko capture karte hain (jaise user ID, slug, etc.).

**Folder structure:**

```
app/
 └── blog/
      └── [slug]/
           └── page.tsx    → /blog/my-first-post, /blog/anything
```

**Page/Server Component mein params access karna:**

```tsx
// app/blog/[slug]/page.tsx
export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await getPostBySlug(slug);

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

**API Route mein dynamic params access karna:**

```ts
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await db.user.findUnique({ where: { id } });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}
```

**Important points:**
- Next.js 15+ mein `params` ek **Promise** hota hai — isliye `await` karna zaroori hai.
- **Catch-all routes:** `[...slug]` — multiple segments capture karta hai (`/blog/a/b/c`).
- **Optional catch-all:** `[[...slug]]` — segment na ho tab bhi match hota hai (`/blog` bhi match karega).

```
app/shop/[...slug]/page.tsx     → /shop/a, /shop/a/b, /shop/a/b/c
app/shop/[[...slug]]/page.tsx   → /shop, /shop/a, /shop/a/b
```

---

## 5. Query Handling

**Kya hai:** Query parameters (`?key=value`) URL ke end mein aate hain aur inhe alag tarike se access kiya jaata hai — Server Components aur Route Handlers dono mein.

### a) Server Component (Page) mein — `searchParams`

```tsx
// app/products/page.tsx
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const { category, sort } = await searchParams;

  const products = await getProducts({ category, sort });

  return (
    <div>
      <h1>Products {category ? `in ${category}` : ""}</h1>
      {/* render products */}
    </div>
  );
}
```

> URL: `/products?category=shoes&sort=price` → `category = "shoes"`, `sort = "price"`

### b) Route Handler mein — `nextUrl.searchParams`

```ts
// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") || "default";
  const page = Number(searchParams.get("page")) || 1;

  const products = await getProducts({ category, sort, page });

  return NextResponse.json(products);
}
```

> URL: `/api/products?category=shoes&page=2` → `.get("category")` = `"shoes"`, `.get("page")` = `"2"`

**Important points:**
- Query params hamesha **string** hote hain — number chahiye toh manually convert karo (`Number()`).
- Multiple values ke liye `.getAll("key")` use karo (jaise `?tag=a&tag=b`).
- `URLSearchParams` standard Web API hai, isliye `.get()`, `.has()`, `.getAll()`, `.toString()` sab methods available hain.

---

## Quick Summary Table

| Concept | Key Point |
|---|---|
| Folder Structure | `route.ts` file se API endpoint banta hai; nested folders = nested paths |
| Server Components | Default rendering mode; server pe run hota hai, JS bundle mein nahi jaata |
| HTTP Methods | Named exports (`GET`, `POST`, `PUT`, `DELETE`) `route.ts` mein |
| Dynamic Routes | `[param]` folder naming; `params` ek Promise hai, `await` zaroori |
| Query Handling | Page mein `searchParams` prop; Route Handler mein `request.nextUrl.searchParams` |

---

## Mental Model

```
Client Request
     │
     ▼
[ route.ts / page.tsx ]  ← Server Component (default)
     │
     ├── Dynamic segment? → params se value nikaalo
     ├── Query string?    → searchParams se value nikaalo
     │
     ▼
Server-side logic (DB call, API call, business logic)
     │
     ▼
Response (JSON / Rendered HTML)
```

> Server Components ka sabse bada fayda yeh hai ki data fetching, business logic aur sensitive operations sab server pe hi reh jaate hain — client sirf final result dekhta hai, extra JS load nahi hota.