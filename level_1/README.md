# Next.js — Installation & Folder Structure Guide

Yeh Level 1 cover karta hai ki Next.js project kaise install karte hain terminal se, setup ke dauraan aane wale saare prompts ka matlab kya hai, aur generate hone wali folder structure kaisi hoti hai.

---

## Installation Command

```bash
npx create-next-app@latest
```

Yeh command `create-next-app` CLI tool run karta hai jo interactively kuch questions poochta hai aur unke answers ke basis pe ek fully configured Next.js project generate kar deta hai.

---

## Setup Prompts — Har Question Ka Explanation

### 1. What is your project named? » `my-app`

**Kya hai:** Yeh tumhare project ka naam hoga — isi naam ki ek folder create hogi jisme pura project setup hoga.

**Important points:**
- Lowercase, hyphens allowed (npm naming convention follow karta hai).
- Yeh `package.json` ke `"name"` field mein bhi save hota hai.

---

### 2. Would you like to use TypeScript? » `No`

**Kya hai:** TypeScript ek JavaScript ka superset hai jo static typing provide karta hai (type-checking, autocomplete, fewer runtime errors).

**Yahan `No` choose kiya gaya hai**, matlab project **plain JavaScript** (`.js`/`.jsx` files) mein banega, TypeScript (`.ts`/`.tsx`) nahi.

**Important points:**
- JavaScript choose karne se setup simpler hota hai, especially beginners ke liye.
- Baad mein bhi chaho toh manually TypeScript add kiya ja sakta hai (`tsconfig.json` create karke).

---

### 3. Would you like to use ESLint? » `yes`

**Kya hai:** ESLint ek code-linting tool hai jo code mein potential errors, bad practices, aur style inconsistencies ko catch karta hai — likhte waqt hi warnings/errors dikha deta hai.

**Kaam:** Code quality maintain karna, common mistakes (unused variables, missing dependencies in hooks, etc.) pakadna.

**Important points:**
- `yes` select karne se `.eslintrc.json` (ya `eslint.config.mjs`) file auto-generate hoti hai Next.js ke recommended rules ke saath.
- Team projects mein especially useful hai — consistent code style enforce karta hai.

---

### 4. Would you like to use Tailwind CSS? » `yes`

**Kya hai:** Tailwind CSS ek utility-first CSS framework hai jisme pre-defined classes (`flex`, `p-4`, `text-center`, etc.) directly JSX mein use karke styling ki jaati hai — bina alag CSS file likhe.

**Kaam:** Rapid UI development — kam code mein fast, responsive, consistent designs banana.

**Important points:**
- `yes` select karne se Tailwind automatically configure ho jaata hai (`tailwind.config.ts`/`globals.css` mein `@import "tailwindcss"` set ho jaata hai).
- No extra setup ki zaroorat — directly `className="flex items-center"` jaisa syntax use kar sakte ho.

```tsx
export default function Button() {
  return (
    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
      Click Me
    </button>
  );
}
```

---

### 5. Would you like to use `src/` directory? » `yes`

**Kya hai:** Yeh decide karta hai ki tumhara application code (`app/`, `components/`, etc.) root level pe rahega ya ek `src/` folder ke andar.

**`yes` select karne se structure aisi banegi:**

```
my-app/
 ├── src/
 │    └── app/
 │         ├── layout.js
 │         ├── page.js
 │         └── globals.css
 ├── public/
 └── package.json
```

**Important points:**
- `src/` use karne ka fayda: project root clean rehta hai — config files (`.env`, `next.config.js`, `package.json`) aur actual source code alag-alag dikhte hain.
- Bade projects mein yeh convention better organization deta hai.

---

### 6. Would you like to use App Router (recommended)? » `Yes`

**Kya hai:** Next.js mein do routing systems hain — purana **Pages Router** (`pages/` folder based) aur naya **App Router** (`app/` folder based, React Server Components pe built).

**`Yes` select karne se App Router use hoga**, jisme:
- File-based routing `app/` folder ke through hoti hai.
- Server Components by default hote hain (Level 5 mein already cover kiya).
- Layouts, loading states, error boundaries jaise special files (Level 3 wale) support hote hain.

**Important points:**
- Yeh Next.js ka **recommended aur future-focused** approach hai — nayi features (Server Actions, Streaming, Parallel Routes) sirf App Router mein aati hain.
- Pages Router legacy support ke liye hai, naye projects ke liye App Router hi use karna chahiye.

---

### 7. Would you like to customize the default import alias? » `No`

**Kya hai:** Import alias ek shortcut path hota hai jisse deep relative imports (`../../../components/Button`) avoid kiye ja sakte hain.

**`No` select karne se default alias use hoga:** `@/*`

**Iska matlab:**

```js
// Without alias (relative import)
import Button from "../../../components/Button";

// With default alias (@/*)
import Button from "@/components/Button";
```

**Important points:**
- Default alias `tsconfig.json` (ya `jsconfig.json` JS projects mein) ke `paths` field mein already configure ho jaata hai.
- `No` choose karne ka matlab hai default `@/*` hi accept kar liya — customize karne ki zaroorat nahi padi.

```json
// jsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

### 8. Would you like to use React Compiler? » `yes`

**Kya hai:** React Compiler ek naya build-time tool hai jo automatically components ko optimize karta hai — manual memoization (`useMemo`, `useCallback`, `React.memo`) ki zaroorat kam kar deta hai.

**Kaam:** Unnecessary re-renders ko automatically detect karke prevent karna, bina developer ko manually optimization code likhne ke.

**Important points:**
- `yes` select karne se babel plugin (`babel-plugin-react-compiler`) automatically install aur configure ho jaata hai.
- Yeh experimental/newer feature hai — performance improve karta hai bina extra boilerplate ke.
- Developer ko ab `useMemo`/`useCallback` har jagah manually likhne ki utni zaroorat nahi padti — compiler khud handle kar leta hai.

---

## Final Generated Folder Structure

In sab answers (`src/` = yes, App Router = yes, TypeScript = No, Tailwind = yes) ke basis pe final structure kuch aisi banegi:

```
my-app/
 ├── src/
 │    └── app/
 │         ├── favicon.ico
 │         ├── globals.css
 │         ├── layout.js
 │         └── page.js
 ├── public/
 │    ├── next.svg
 │    └── vercel.svg
 ├── node_modules/
 ├── .eslintrc.json (ya eslint.config.mjs)
 ├── .gitignore
 ├── jsconfig.json
 ├── next.config.js
 ├── package.json
 ├── package-lock.json
 ├── postcss.config.js (Tailwind ke liye)
 └── README.md
```

### Folder/File Explanation

| Item | Purpose |
|---|---|
| `src/app/` | Main application code — routing, layouts, pages (App Router) |
| `src/app/layout.js` | Root layout — `<html>`, `<body>` tags define karta hai |
| `src/app/page.js` | Homepage (`/` route) |
| `src/app/globals.css` | Global styles + Tailwind directives |
| `public/` | Static assets (images, icons, fonts) — directly `/filename` se accessible |
| `node_modules/` | Saari installed dependencies |
| `.eslintrc.json` | ESLint configuration/rules |
| `jsconfig.json` | Import alias (`@/*`) aur JS project settings |
| `next.config.js` | Next.js ka main configuration file (images, redirects, env, etc.) |
| `package.json` | Project dependencies, scripts (`dev`, `build`, `start`) |
| `postcss.config.js` | Tailwind CSS ko PostCSS ke through process karne ke liye |

---

## Project Run Karna

```bash
cd my-app
npm run dev
```

Yeh command development server start karega — default `http://localhost:3000` pe project open hoga.

---

## Quick Summary Table

| Prompt | Answer | Effect |
|---|---|---|
| Project name | `my-app` | Folder/package name |
| TypeScript | No | Plain JavaScript project |
| ESLint | Yes | Code linting enabled |
| Tailwind CSS | Yes | Utility-first CSS ready to use |
| `src/` directory | Yes | Code `src/` ke andar organize hota hai |
| App Router | Yes | Modern file-based routing + Server Components |
| Import alias | No | Default `@/*` alias use hota hai |
| React Compiler | Yes | Auto-memoization, manual optimization kam chahiye |

> Yeh setup ek **modern, well-organized Next.js project** deta hai — Server Components ready, utility-first styling, clean import paths, aur linting sab out-of-the-box configured.