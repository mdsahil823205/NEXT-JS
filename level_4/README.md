# Next.js — Navigation, Image & Font Optimization Guide

Yeh Level 4 topics cover karte hain ki Next.js mein navigation kaise hota hai (declarative aur programmatic dono), aur images/fonts ko optimize kaise kiya jaata hai built-in components se.

---

## 1. Declarative Navigation — `<Link>`

**Kya hai:** `next/link` se import hone wala `<Link>` component HTML ke `<a>` tag ka enhanced version hai, jo client-side navigation provide karta hai bina full page reload ke.

**Kaam:** Ek route se dusre route pe jaane ke liye jab tumhe seedha JSX mein clickable element chahiye (button, nav item, card, etc.).

**Important points:**
- **Prefetching:** Jab `<Link>` viewport mein aata hai (production mein), Next.js automatically us route ka JS aur data prefetch kar leta hai — isse navigation instant lagta hai.
- **Client-side transition:** Full page reload nahi hota, sirf jo content change hua hai wahi re-render hota hai.
- `href` prop mandatory hai — string ya object dono le sakta hai.
- `replace` prop se history stack mein naya entry add hone ke bajaye current entry replace ho jaati hai.
- `scroll={false}` se navigation ke baad auto scroll-to-top disable kar sakte ho.

```tsx
import Link from "next/link";

export default function Nav() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href={{ pathname: "/blog/[slug]", query: { slug: "nextjs" } }}>
        Blog Post
      </Link>
    </nav>
  );
}
```

**Use-case:** Static links — navbar, footer links, sidebar menu, "view more" cards.

---

## 2. Programmatic Navigation — `useRouter`

**Kya hai:** `next/navigation` se `useRouter` hook milta hai jo tumhe JavaScript logic ke through navigation control karne deta hai — event handlers, conditions, ya async operations ke baad.

**Kaam:** Jab navigation ek user action ya condition pe depend karta hai — jaise form submit ke baad redirect, ya login success ke baad dashboard pe bhejna.

**Important points:**
- Sirf **Client Components** mein use hota hai (`"use client"` zaroori).
- Methods available:
  - `router.push(href)` — naya route history mein add karke navigate karta hai.
  - `router.replace(href)` — current history entry replace karta hai (back button se pichhle page pe nahi ja sakte).
  - `router.back()` — previous page pe wapas jaata hai.
  - `router.forward()` — forward navigate karta hai.
  - `router.refresh()` — current route ko server se refresh karta hai (data re-fetch), bina full reload ke.
  - `router.prefetch(href)` — manually kisi route ko prefetch karna.

```tsx
"use client";

import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const handleSubmit = async () => {
    const success = await loginUser();
    if (success) {
      router.push("/dashboard");
    }
  };

  return <button onClick={handleSubmit}>Login</button>;
}
```

**Use-case:** Form submissions, authentication redirects, conditional navigation, modal close karke navigate karna.

---

### `<Link>` vs `useRouter` — Kab Kya Use Karein

| Scenario | Use |
|---|---|
| Simple clickable link (navbar, card) | `<Link>` |
| SEO ke liye crawlable anchor chahiye | `<Link>` |
| Form submit ke baad redirect | `useRouter` |
| Condition check karke navigate karna | `useRouter` |
| Button click pe logic + navigation dono | `useRouter` |

---

## 3. Image Optimization — `<Image>`

**Kya hai:** `next/image` ka `<Image>` component HTML `<img>` tag ka optimized version hai jo automatic image optimization provide karta hai.

**Kaam:** Images ko automatically resize, optimize aur lazy-load karna — performance aur Core Web Vitals improve karne ke liye.

**Key features:**
- **Automatic format optimization:** Modern formats jaise WebP/AVIF mein serve karta hai agar browser support kare.
- **Responsive sizing:** `sizes` prop ke through different screen sizes ke liye different image sizes serve karta hai.
- **Lazy loading:** By default images tabhi load hoti hain jab woh viewport ke paas aati hain (`loading="lazy"` default hai).
- **Layout shift prevention:** `width` aur `height` (ya `fill`) specify karna mandatory hota hai taaki CLS (Cumulative Layout Shift) na ho.
- **Priority loading:** Above-the-fold images ke liye `priority` prop use karo taaki woh eagerly load ho (LCP improve hota hai).

```tsx
import Image from "next/image";
import profilePic from "../public/profile.png";

export default function Profile() {
  return (
    <Image
      src={profilePic}
      alt="Profile picture"
      width={500}
      height={500}
      priority
    />
  );
}
```

**Remote images ke liye:**

```tsx
<Image
  src="https://example.com/photo.jpg"
  alt="Remote photo"
  width={800}
  height={600}
/>
```

> Remote images ke liye `next.config.js` mein `images.remotePatterns` ya `images.domains` config karna padta hai, warna Next.js block kar dega.

**`fill` prop ka use (jab parent container ka size defined ho):**

```tsx
<div style={{ position: "relative", width: "100%", height: "300px" }}>
  <Image src={profilePic} alt="Banner" fill style={{ objectFit: "cover" }} />
</div>
```

---

## 4. Font Optimization — Local Fonts

**Kya hai:** `next/font/local` ka use karke custom/local font files (`.woff`, `.woff2`, `.ttf`) ko optimize karke load kiya ja sakta hai, bina external network request ke.

**Kaam:** Font loading ko self-host karna aur automatically optimize karna — layout shift avoid karna aur performance improve karna.

**Important points:**
- Fonts build time par download/process hoti hain aur static assets ke saath self-host ho jaati hain — koi extra network request browser se external server ko nahi jaati.
- Automatic `font-display` optimization se layout shift (CLS) minimize hota hai.
- Multiple weights/styles ek saath define kiye ja sakte hain array ke through.
- Generated CSS variable ya className ko Tailwind/CSS mein use kiya ja sakta hai.

```tsx
// app/fonts.ts
import localFont from "next/font/local";

export const myFont = localFont({
  src: [
    {
      path: "../public/fonts/MyFont-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/MyFont-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-my-font",
});
```

```tsx
// app/layout.tsx
import { myFont } from "./fonts";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={myFont.variable}>
      <body>{children}</body>
    </html>
  );
}
```

**Google Fonts ke liye comparison** (bonus — `next/font/google`):

```tsx
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "700"] });
```

> Google Fonts bhi build time pe self-host ho jaati hain — Next.js automatically download karke serve karta hai, koi Google server ko runtime request nahi jaati.

---

## Quick Summary Table

| Feature | Import From | Key Benefit |
|---|---|---|
| `<Link>` | `next/link` | Prefetching + client-side transitions |
| `useRouter` | `next/navigation` | Programmatic/conditional navigation |
| `<Image>` | `next/image` | Auto-resize, lazy load, modern formats |
| Local Fonts | `next/font/local` | Self-hosted, zero layout shift, no external request |

---

## Why This Matters (Performance Angle)

- **Navigation:** Client-side transitions + prefetching se app SPA jaisa fast feel karta hai.
- **Images:** Auto-optimization se page weight kam hota hai aur LCP (Largest Contentful Paint) improve hota hai.
- **Fonts:** Self-hosting se external DNS lookup/network request avoid hoti hai, aur CLS control mein rehta hai.

> In teeno optimizations ka combined effect Next.js apps ko production mein significantly fast aur SEO-friendly banata hai.