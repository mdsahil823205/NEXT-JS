# Next.js Routing Guide (Level 2)

Yeh document Next.js (App Router) ke complete routing concepts ko simple Hinglish aur clean examples ke sath explain karta hai — Basic routing se lekar Advanced parallel routes tak.

---

## 🧭 Routing Types & Explanation

### 1. Basic Routing
* **Matlab:** Ek page se dusre page par jana. Routing create karne ke liye `app/` folder ke andar us name ka folder banate hain aur usme `page.js` file hona mandatory hai.
* **Folder Path:** `app/about/page.js`
* **URL:** `http://localhost:3000/about`

---

### 2. Nested Routing
* **Matlab:** Ek folder ke andar dusra sub-folder banana nested routing kehlata hai.
* **Folder Path:** `app/about/dashboard/page.js`
* **URL:** `http://localhost:3000/about/dashboard`

---

### 3. Dynamic Route Segment (`[param]`)
* **Matlab:** Jab URL ka parameter dynamic ho (jaise user ID, product slug). URL me `/` ke baad kuch bhi likhne par ye route match hota hai aur data `params` object se access hota hai.
* **Folder Path:** `app/profile/[username]/page.js`
* **URL:** `http://localhost:3000/profile/sahil` ya `http://localhost:3000/profile/vikash`
* **Output:** `params.username = "sahil"`

---

### 4. Catch-all Route Segment (`[...slug]`)
* **Matlab:** Dynamic route sirf **1 level** catch karta hai. Agar URL me slash ke baad **multiple segments** (kitne bhi levels) ho sakte hain, toh 3 dots ke sath Catch-all route banta hai.
* **Folder Path:** `app/docs/[...slug]/page.js`
* **URL Match:**
  * `/docs/nextjs` ➔ `params.slug = ['nextjs']`
  * `/docs/nextjs/routing` ➔ `params.slug = ['nextjs', 'routing']`
* **Note:** Agar user sirf `/docs` kholega, toh **404 Page Not Found** aayega (minimum 1 segment required).

---

### 5. Optional Catch-all Route Segment (`[[...slug]]`)
* **Matlab:** Catch-all route jaisa hi hai, lekin isme parameter **optional** hota hai. Double brackets lagane par bina slug wala root route bhi chal jata hai.
* **Folder Path:** `app/docs/[[...slug]]/page.js`
* **URL Match:**
  * `/docs` ➔ `params.slug = undefined` *(404 nahi aayega)*
  * `/docs/react` ➔ `params.slug = ['react']`
  * `/docs/react/hooks/useState` ➔ `params.slug = ['react', 'hooks', 'useState']`

---

### 6. Route Group (`(groupName)`)
* **Matlab:** Folders ko sirf code organization ke liye group karna bina unhe browser URL path me include kiye.
* **Syntax:** Folder name parentheses `( )` ke andar likha jata hai.
* **Folder Path:** `app/(auth)/login/page.js`
* **URL:** `http://localhost:3000/login` *(auth URL me add nahi hoga)*
* **Use Case:** Clean folder organization aur alag-alag routes par alag-alag `layout.js` apply karna.

---

### 7. Parallel Routes (`@slotName`)
* **Matlab:** Ek hi screen/layout ke andar **ek sath 2 ya usse zyada independent sections/pages** ko parallel render karna.
* **Syntax:** Folder name `@` symbol se shuru hota hai.
* **Folder Structure:**
  ```text
  app/dashboard/
  ├── @analytics/
  │   └── page.js
  ├── @team/
  │   └── page.js
  ├── layout.js
  └── page.js