# Next.js — Routing Guide (App Router)

Yeh Level 2 cover karta hai Next.js App Router ke saare routing patterns — basic routing se lekar advanced concepts jaise parallel routing tak.

---

## 1. Routing

**Kya hai:** Next.js App Router mein routing **file-system based** hoti hai — `app` folder ke andar har folder ek URL segment represent karta hai, aur usme rakhi `page.tsx` file us route ka UI banati hai.

**Kaam:** Folder banao → uske andar `page.tsx` daalo → route automatically ban jaata hai, koi manual route config likhne ki zaroorat nahi.

```
app/
 ├── page.tsx          → /
 ├── about/
 │    └── page.tsx     → /about
 └── contact/
      └── page.tsx     → /contact
```

```tsx
// app/about/page.tsx
export default function About() {
  return <h1>About Us</h1>;
}
```

**Important points:**
- Sirf `page.tsx` (ya `.js`) hi route ko publicly accessible banata hai — folder ke andar sirf components rakhne se woh route nahi banta.
- Folder ka naam hi URL path banta hai (lowercase, hyphens allowed).

---

## 2. Nested Routing

**Kya hai:** Folders ke andar folders banake tum nested URLs create kar sakte ho — jaise real file system mein hota hai.

**Kaam:** Hierarchical pages banana jahan ek route ke andar sub-routes ho — jaise `/dashboard/settings`, `/blog/tech`.

```
app/
 └── dashboard/
      ├── page.tsx           → /dashboard
      ├── settings/
      │    └── page.tsx      → /dashboard/settings
      └── analytics/
           └── page.tsx      → /dashboard/analytics
```

**Important points:**
- Har nested folder apna khud ka `layout.tsx` bhi rakh sakta hai — jo sirf uske andar ke routes pe apply hoga.
- Layouts automatically nest ho jaate hain: `RootLayout > DashboardLayout > SettingsPage`.

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

---

## 3. Dynamic Routing — `[folder]`

**Kya hai:** Jab URL ka koi part **variable/dynamic** ho (jaise user ID, product slug), tab folder ka naam square brackets `[paramName]` mein rakha jaata hai.

**Kaam:** Ek hi template se multiple pages generate karna — jaise `/products/1`, `/products/2`, `/products/anything`.

```
app/
 └── products/
      └── [id]/
           └── page.tsx    → /products/1, /products/2, /products/shoes
```

```tsx
// app/products/[id]/page.tsx
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <h1>Product ID: {id}</h1>;
}
```

**Important points:**
- `params` App Router (Next.js 15+) mein ek **Promise** hota hai — `await` karna zaroori hai.
- Multiple dynamic segments bhi ek saath rakhe ja sakte hain: `app/blog/[category]/[slug]/page.tsx`.

---

## 4. Catch-All Route Segment — `[...folder]`

**Kya hai:** Yeh ek dynamic segment hai jo **multiple URL parts ko ek saath** capture kar leta hai — array ke form mein.

**Kaam:** Jab URL ki depth fixed na ho — jaise documentation sites, file explorers, nested categories.

```
app/
 └── shop/
      └── [...slug]/
           └── page.tsx
```

| URL | Matches? | `slug` value |
|---|---|---|
| `/shop/a` | ✅ | `["a"]` |
| `/shop/a/b` | ✅ | `["a", "b"]` |
| `/shop/a/b/c` | ✅ | `["a", "b", "c"]` |
| `/shop` | ❌ | matches nahi karega |

```tsx
// app/shop/[...slug]/page.tsx
export default async function Shop({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  return <p>Path segments: {slug.join(" / ")}</p>;
}
```

**Important points:**
- Kam se kam **ek segment zaroori hai** — bina segment ke (`/shop`) yeh match nahi karega, 404 aayega.
- `slug` hamesha ek **array** hota hai.

---

## 5. Optional Catch-All Route Segment — `[[...folder]]`

**Kya hai:** Yeh catch-all ka hi variant hai, lekin **double square brackets** ke saath — isse base route (bina kisi segment ke) bhi match ho jaata hai.

**Kaam:** Jab tumhe chahiye ki `/shop` (koi segment nahi) bhi valid ho, saath hi `/shop/a`, `/shop/a/b` bhi.

```
app/
 └── shop/
      └── [[...slug]]/
           └── page.tsx
```

| URL | Matches? | `slug` value |
|---|---|---|
| `/shop` | ✅ | `undefined` |
| `/shop/a` | ✅ | `["a"]` |
| `/shop/a/b` | ✅ | `["a", "b"]` |

```tsx
// app/shop/[[...slug]]/page.tsx
export default async function Shop({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;

  if (!slug) return <p>Showing all products</p>;

  return <p>Filtered by: {slug.join(" / ")}</p>;
}
```

**Important points:**
- Normal catch-all (`[...slug]`) aur optional catch-all (`[[...slug]]`) mein bas itna farak hai — optional wala **base route ko bhi optional** bana deta hai.
- `slug` value `undefined` bhi ho sakti hai, isliye type mein `?` lagana zaroori hai.

---

## 6. Routing Groups — `(folder)`

**Kya hai:** Parentheses `(folderName)` mein rakha gaya folder **URL path mein include nahi hota** — sirf organizational purpose ke liye use hota hai.

**Kaam:** Routes ko logically group karna (jaise auth pages ek jagah, marketing pages ek jagah) bina URL structure change kiye. Alag layouts bhi assign kiye ja sakte hain har group ko.

```
app/
 ├── (marketing)/
 │    ├── layout.tsx
 │    ├── about/
 │    │    └── page.tsx      → /about (NOT /marketing/about)
 │    └── contact/
 │         └── page.tsx      → /contact
 └── (auth)/
      ├── layout.tsx
      ├── login/
      │    └── page.tsx      → /login
      └── register/
           └── page.tsx      → /register
```

**Important points:**
- Folder ka naam bracket ke andar hai isliye URL mein `(marketing)` ya `(auth)` kabhi nahi dikhega.
- Har group apna alag `layout.tsx` rakh sakta hai — jaise auth pages ke liye minimal layout, marketing pages ke liye navbar/footer wala layout.
- Multiple root layouts banane ke liye bhi use hota hai.

---

## 7. Parallel Routing — `@folder`

**Kya hai:** `@folderName` convention se **"slots"** create hote hain — yeh ek hi layout ke andar **multiple independent pages ko ek saath, side-by-side render** karne deta hai.

**Kaam:** Complex dashboards banana jahan multiple sections (jaise analytics + notifications + team feed) independently render, load aur navigate ho sakein — ek dusre ko affect kiye bina.

```
app/
 ├── layout.tsx
 ├── @analytics/
 │    └── page.tsx
 ├── @team/
 │    └── page.tsx
 └── page.tsx
```

**Layout mein slots ko props ke through receive karna:**

```tsx
// app/layout.tsx
export default function Layout({
  children,
  analytics,
  team,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  team: React.ReactNode;
}) {
  return (
    <div>
      {children}
      <div className="grid grid-cols-2">
        {analytics}
        {team}
      </div>
    </div>
  );
}
```

**Important points:**
- `@folder` khud URL segment nahi banata — yeh sirf slot naam hai, layout ko prop ke through pass hota hai.
- Har slot **independently** loading, error states rakh sakta hai (apna `loading.tsx`, `error.tsx`).
- Agar navigation ke time kisi slot ka matching state na mile (jaise refresh), tab uss slot ka **`default.tsx`** fallback render hota hai (Level 3 mein cover kiya tha).
- Conditional rendering bhi possible hai — jaise role-based dashboards (`@admin` vs `@user`).

---

## Quick Summary Table

| Concept | Syntax | URL Effect | Use Case |
|---|---|---|---|
| Routing | `folder/page.tsx` | `/folder` | Basic pages |
| Nested Routing | `folder/subfolder/page.tsx` | `/folder/subfolder` | Hierarchical pages |
| Dynamic Routing | `[param]` | `/folder/:param` | User ID, product slug |
| Catch-All | `[...slug]` | `/folder/*` (1+ segments) | Docs, file explorers |
| Optional Catch-All | `[[...slug]]` | `/folder` + `/folder/*` (0+ segments) | Flexible filters |
| Routing Group | `(folder)` | URL mein nahi dikhta | Organize + alag layouts |
| Parallel Routing | `@folder` | URL mein nahi dikhta (slot) | Multi-section dashboards |

---

## Mental Model — Sab Ek Saath

```
app/
 ├── (marketing)/              ← Routing Group (URL mein invisible)
 │    └── about/page.tsx       → /about
 │
 ├── dashboard/
 │    ├── layout.tsx
 │    ├── @analytics/          ← Parallel Route Slot
 │    │    └── page.tsx
 │    ├── @team/                ← Parallel Route Slot
 │    │    └── page.tsx
 │    ├── [projectId]/          ← Dynamic Route
 │    │    └── page.tsx        → /dashboard/123
 │    └── settings/
 │         └── [...params]/    ← Catch-All Route
 │              └── page.tsx   → /dashboard/settings/a/b/c
```

> Yeh saare patterns ek dusre ke saath **combine** ho sakte hain — real-world apps mein aksar routing groups, dynamic routes, aur parallel routes ek hi project mein saath-saath use hote hain complex UI banane ke liye.