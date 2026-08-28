# Next.js Project Structure & Fundamentals (Level 1)

Welcome to the foundational guide on Next.js project architecture. This document breaks down the standard file and folder structure created in a modern Next.js project (App Router) along with the specific roles and responsibilities of each file.

---

## 📁 Visual Folder Tree
my-next-app/
├── .next/                  # Auto-generated build aur cache folder
├── node_modules/           # Sabhi installed npm packages/dependencies
├── public/                 # Static assets (images, icons, fonts)
├── src/                    # Source code wrapper (clean setup ke liye)
│   └── app/                # App Router: file-system based routing folder
│       ├── favicon.ico     # Website favicon
│       ├── globals.css     # Global CSS styling
│       ├── layout.js       # Main root layout (HTML skeleton, navbar/footer)
│       └── page.js         # Root homepage route (/)
├── .gitignore              # Files jo GitHub par push nahi karni
├── eslint.config.mjs       # Code quality aur syntax checking rules
├── jsconfig.json           # Path aliasing config (jaise @/* import karna)
├── next.config.mjs         # Next.js custom configuration settings
├── package-lock.json       # Exact package versions ka record/lock
├── package.json            # Project details, scripts aur package list
└── postcss.config.mjs      # Tailwind CSS compilation ke liye config

