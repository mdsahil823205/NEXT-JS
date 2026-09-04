# 🚀 NextAuth & Cloudinary Full-Stack Authentication & Profile Manager

A modern, production-ready Full-Stack User Authentication and Profile Management web application built with **Next.js 16 (App Router)**, **React 19**, **NextAuth.js**, **MongoDB (Mongoose)**, **Cloudinary**, and **Tailwind CSS**.

---

## 📌 Overview

This project provides a complete, scalable boilerplate and solution for user identity, authentication, and profile customization. It supports dual authentication methods (**Credentials Email/Password** and **Google OAuth 2.0**), database persistence via MongoDB, and seamless profile image uploads handled securely using Cloudinary.

The UI is crafted with a modern dark-mode aesthetic, glassmorphism, responsive mobile-first layouts, and real-time state synchronization via React Context and NextAuth session updates.

---

## ✨ Key Features

- **🔐 Dual Authentication System**:
  - **Credentials Authentication**: Secure registration and login with email and hashed passwords via `bcryptjs`.
  - **OAuth 2.0 Social Login**: One-click authentication with Google.
- **🖼️ Media Upload & Storage**:
  - Direct file upload using Next.js `FormData` API.
  - Server-side streaming buffer upload to **Cloudinary** (`next-project` folder).
  - Instant client-side image preview before saving.
- **⚡ Real-Time State Management**:
  - Synchronized user state via `UserContext` and NextAuth `update()` session hook.
  - Instant avatar and name reflection across profile and navigation without full page reloads.
- **🛡️ Secure & Cached Database Connection**:
  - MongoDB connection pooling and global caching optimized for Next.js serverless route handlers.
- **🎨 Modern Dark UI / UX**:
  - Tailwind CSS v4 styling with dark glassmorphism, amber highlights, micro-interactions, and responsive cards.
  - Loading skeletons, disabled state handling, and error notifications.
- **🔒 Protected Routes & Session Handling**:
  - Route authorization, unauthenticated redirects, and secure JWT session management.

---

## 🛠️ Tech Stack

| Domain | Technology / Library |
| --- | --- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) |
| **Frontend Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) & [React Icons](https://react-icons.github.io/react-icons/) |
| **Authentication** | [NextAuth.js v4](https://next-auth.js.org/) |
| **Password Hashing** | [bcryptjs](https://www.npmjs.com/package/bcryptjs) |
| **Database & ODM** | [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) |
| **Cloud Storage** | [Cloudinary v2](https://cloudinary.com/) |
| **HTTP Client** | [Axios](https://axios-http.com/) |

---

## 📁 Project Structure

```text
project/
├── public/                     # Static assets & icons
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/route.ts  # NextAuth core handler (Google & Credentials)
│   │   │   │   └── register/route.ts       # User registration endpoint
│   │   │   ├── edit/route.ts               # Profile update & Cloudinary upload endpoint
│   │   │   └── user/route.ts               # Fetch authenticated user profile
│   │   ├── edit/page.tsx                   # Edit profile page with image upload
│   │   ├── login/page.tsx                  # Sign-in page with Credentials & Google OAuth
│   │   ├── register/page.tsx               # Sign-up page
│   │   ├── globals.css                     # Global styles & Tailwind config
│   │   ├── layout.tsx                      # Root layout wrapping Session & Context Providers
│   │   └── page.tsx                        # Protected Profile / Dashboard page
│   ├── context/
│   │   └── userContext.tsx                 # Global UserContext for profile data synchronization
│   ├── lib/
│   │   ├── auth.ts                         # NextAuth configuration and providers
│   │   ├── cloudinary.ts                   # Cloudinary buffer upload utility
│   │   └── db.ts                           # Cached MongoDB connection utility
│   ├── model/
│   │   └── user.model.ts                   # Mongoose User Schema
│   ├── ClientProvider.tsx                  # SessionProvider wrapper for Next.js Client Components
│   ├── next-auth.d.ts                      # TypeScript declaration augmentations for NextAuth
│   └── proxy.ts                            # Network / agent proxy utilities
├── .env.example                            # Sample environment variables
├── next.config.ts                          # Next.js configuration
├── package.json                            # Project dependencies and scripts
├── tsconfig.json                           # TypeScript configuration
└── README.md                               # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your development machine:
- **Node.js**: `v18.18.0` or later (Node 20+ recommended)
- **npm**, **pnpm**, or **yarn**
- A **MongoDB** database instance (MongoDB Atlas or local)
- A **Cloudinary** account (for media storage)
- A **Google Cloud Console** project (for Google OAuth credentials)

---

### 1. Clone the Repository

```bash
git clone https://github.com/mdsahil823205/NEXT-JS.git
cd NEXT-JS/project
```

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Setup Environment Variables

Create a `.env` file in the root of the `project` directory and configure the following parameters:

```env
# Server & NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_jwt_key_here

# MongoDB Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/your-db-name?retryWrites=true&w=majority

# Google OAuth Credentials (Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary Storage Configuration
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
```

> **Tip:** You can generate a strong `NEXTAUTH_SECRET` by running:
> ```bash
> openssl rand -base64 32
> ```

---

### 4. Running the Application

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🔌 API Reference

### 1. Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register a new user with `name`, `email`, and `password`. |
| `POST` | `/api/auth/signin` | Sign in via NextAuth Credentials or OAuth providers. |
| `GET/POST` | `/api/auth/[...nextauth]` | Catch-all route for NextAuth callbacks, tokens, and sessions. |

### 2. User & Profile

| Method | Endpoint | Auth Required | Description |
| --- | --- | --- | --- |
| `GET` | `/api/user` | **Yes** | Fetches the authenticated user's profile details excluding the password. |
| `POST` | `/api/edit` | **Yes** | Accepts `multipart/form-data` with `name` and optional `file` to upload avatar to Cloudinary and update database. |

---

## ⚙️ Third-Party Services Configuration

### Google Cloud OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project and navigate to **APIs & Services** > **Credentials**.
3. Create **OAuth 2.0 Client IDs** (Application Type: *Web application*).
4. Add the following to **Authorized redirect URIs**:
   ```text
   http://localhost:3000/api/auth/callback/google
   ```
5. Copy the **Client ID** and **Client Secret** to your `.env` file.

### Cloudinary Setup
1. Sign up or log into [Cloudinary](https://cloudinary.com/).
2. Navigate to your Dashboard.
3. Copy **Cloud Name**, **API Key**, and **API Secret** into your `.env` file.
4. Uploads are placed automatically in the `next-project` folder on your Cloudinary dashboard.

---

## 📜 Available Scripts

| Command | Action |
| --- | --- |
| `npm run dev` | Starts the Next.js development server on `localhost:3000` |
| `npm run build` | Compiles the production build |
| `npm run start` | Runs the compiled production server |
| `npm run lint` | Runs ESLint to check for code quality and errors |

---

## 🤝 Contributing

Contributions are always welcome! If you'd like to improve this project:
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m "Add some AmazingFeature"`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the **MIT License**.
