# Next.js App Router — Routing Files Guide

Next.js ke App Router (Level 3 concept) mein har ek special file ka apna specific role hota hai. In sabko `app` folder ke andar kisi bhi route segment mein use kiya ja sakta hai. Neeche har file ka explanation, use-case aur example diya gaya hai.

---

## 1. `layout.tsx`

**Kya hai:** Layout ek shared UI hai jo multiple pages ke beech persist (bana) rehta hai navigation ke time bhi. Yeh re-render nahi hota jab tak zaroorat na ho, isliye state preserve rehti hai.

**Kaam:** Common structure define karta hai — jaise navbar, sidebar, footer — jo har child page ke around wrap ho jaata hai.

**Important points:**
- Root layout (`app/layout.tsx`) mandatory hota hai, aur usme `<html>` aur `<body>` tags hone chahiye.
- Nested layouts bhi ban sakte hain — har folder apna layout define kar sakta hai.
- `children` prop accept karta hai jisme actual page render hota hai.

```tsx
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
```

---

## 2. `page.tsx`

**Kya hai:** Yeh ek route ko publicly accessible banata hai. Jis folder mein `page.tsx` hoga, wahi route UI render hoga.

**Kaam:** Actual content/UI jo user ko us specific URL par dikhna chahiye.

**Important points:**
- Har route segment ka apna unique `page.tsx` hota hai.
- Bina `page.tsx` ke woh folder public route nahi banta (sirf layout ya component organization ke liye use ho sakta hai).

```tsx
export default function Page() {
  return <h1>Home Page</h1>;
}
```

---

## 3. `loading.tsx`

**Kya hai:** Ek automatic loading UI jo React Suspense boundary use karke show hota hai jab tak page ka data fetch complete nahi hota.

**Kaam:** User ko instant feedback dena ki page load ho raha hai — better perceived performance ke liye.

**Important points:**
- Automatically wraps `page.tsx` and children in a `<Suspense>` boundary.
- Server-rendered ho ya client-side navigation, dono mein kaam karta hai.

```tsx
export default function Loading() {
  return <p>Loading...</p>;
}
```

---

## 4. `not-found.tsx`

**Kya hai:** Jab `notFound()` function call ho ya URL kisi bhi matching route se resolve na ho, tab yeh UI render hoti hai.

**Kaam:** Custom 404-type page dikhana instead of default error.

**Important points:**
- Root level pe global 404 ke liye use hota hai.
- Nested segment mein bhi define kar sakte ho for segment-specific "not found" UI.
- `notFound()` ko manually bhi trigger kiya ja sakta hai kisi bhi server component se.

```tsx
export default function NotFound() {
  return <h2>404 - Page Not Found</h2>;
}
```

---

## 5. `error.tsx`

**Kya hai:** Yeh ek Error Boundary hai jo runtime errors ko catch karta hai us specific route segment aur uske children ke liye.

**Kaam:** Graceful error handling — pura app crash hone se bachta hai, sirf affected segment error UI show karta hai.

**Important points:**
- Must be a **Client Component** (`"use client"` zaroori hai).
- `error` aur `reset` do props milte hain — `reset()` se user page ko retry kar sakta hai.
- Parent layout ka UI preserve rehta hai, sirf child segment ka UI replace hota hai.

```tsx
"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <p>Something went wrong!</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

---

## 6. `global-error.tsx`

**Kya hai:** Yeh root layout ya root template mein aane wale errors ko catch karta hai — sabse top-level error boundary.

**Kaam:** Jab root level pe hi kuch crash ho jaaye (jaise root layout khud fail ho jaaye), tab yeh fallback UI dikhata hai.

**Important points:**
- Sirf production mein active hota hai.
- Isko apna khud ka `<html>` aur `<body>` render karna padta hai kyunki yeh root layout ko bhi replace kar deta hai.
- `app` folder ke root mein hi define hota hai — `app/global-error.tsx`.

```tsx
"use client";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body>
        <h2>Something went seriously wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
```

---

## 7. `route.ts` (Route Handlers)

**Kya hai:** Yeh API endpoints banane ke liye use hota hai App Router mein — pages ke bajaye backend logic ke liye.

**Kaam:** Custom request handlers (GET, POST, PUT, DELETE, etc.) define karna kisi bhi route segment ke liye.

**Important points:**
- File ka naam hamesha `route.ts` (ya `.js`) hona chahiye.
- Same folder mein `page.tsx` aur `route.ts` dono nahi ho sakte (conflict hota hai).
- Web Request/Response APIs use karta hai.

```ts
export async function GET(request: Request) {
  return Response.json({ message: "Hello World" });
}

export async function POST(request: Request) {
  const body = await request.json();
  return Response.json({ received: body });
}
```

---

## 8. `template.tsx`

**Kya hai:** Layout jaisa hi hota hai, lekin har navigation par yeh **naya instance** create karta hai (re-mount hota hai) instead of persisting state.

**Kaam:** Jab tumhe har page visit par fresh state, re-triggered animations, ya `useEffect` dobara run karwana ho, tab template use karo layout ki jagah.

**Important points:**
- Layout ke andar wrap hota hai: `Layout > Template > Page`.
- DOM elements recreate hote hain, state reset ho jaati hai.
- Use-case: enter/exit animations, form reset on navigation, analytics tracking per page view.

```tsx
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="fade-in">{children}</div>;
}
```

---

## 9. `default.tsx`

**Kya hai:** Yeh Parallel Routes ke context mein use hota hai — jab kisi slot ka matching state na mile during navigation (jaise browser refresh ke baad), tab fallback UI ke roop mein render hota hai.

**Kaam:** Parallel routes (`@slot` folders) ke liye fallback provide karna jab active state determine nahi ho pata.

**Important points:**
- Sirf parallel routes ke saath relevant hai (advanced routing pattern).
- Agar `default.tsx` nahi diya, toh Next.js 404 throw kar dega us slot ke liye.

```tsx
export default function Default() {
  return null;
}
```

---

## Quick Summary Table

| File | Purpose | Client/Server |
|---|---|---|
| `layout.tsx` | Persistent shared UI | Server (default) |
| `page.tsx` | Route ka main UI | Server (default) |
| `loading.tsx` | Suspense fallback UI | Server (default) |
| `not-found.tsx` | 404 UI | Server (default) |
| `error.tsx` | Segment-level error boundary | Client (required) |
| `global-error.tsx` | Root-level error boundary | Client (required) |
| `route.ts` | API endpoint handler | Server only |
| `template.tsx` | Re-mounting layout | Server (default) |
| `default.tsx` | Parallel routes fallback | Server (default) |

---

## Rendering Hierarchy (Top to Bottom)

```
global-error.tsx
 └── layout.tsx
      └── template.tsx
           └── error.tsx
                └── loading.tsx (Suspense)
                     └── not-found.tsx (conditional)
                          └── page.tsx
```

> Yeh hierarchy batati hai ki jab request aati hai, toh Next.js kis order mein in special files ko wrap karke final UI render karta hai.