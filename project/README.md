1. create userModel-->

import mongoose from "mongoose";

interface Iuser {
\_id?: mongoose.Types.ObjectId;
name: string;
email: string;
password: string;
image: string;
createdAt?: Date;
updatedAt?: Date;
}

const userSchema = new mongoose.Schema<Iuser>(
{
name: {
type: String,
required: true,
},
email: {
type: String,
required: true,
unique: true,
},
password: {
type: String,
required: true,
},
image: {
type: String,
required: true,
},
},
{
timestamps: true,
},
);

export const User=mongoose.models.User || mongoose.model<Iuser>("User",userSchema)

2. connection db function
   import { connect, Connection } from "mongoose";

declare global {
var mongoose:
| {
conn: Connection | null;
promise: Promise<Connection> | null;
}
| undefined;
}

const mongoDbUri = process.env.MONGODB_URI;
if (!mongoDbUri) {
throw new Error("Please provide MONGODB_URI");
}

let cache = global.mongoose;

if (!cache) {
cache = global.mongoose = { conn: null, promise: null };
}

export const connectionDb = async (): Promise<Connection> => {
if (cache.conn) return cache.conn;

if (!cache.promise) {
const opts = { bufferCommands: false };
cache.promise = connect(mongoDbUri, opts).then((c) => c.connection);
}

try {
cache.conn = await cache.promise;
} catch (error) {
cache.promise = null;
throw error;
}

return cache.conn;
};

3. authentication
   1. for register ---> app/api/auth/register/route.ts
      import { connectionDb } from "@/lib/db";
      import { User } from "@/model/user.model";
      import bcrypt from "bcryptjs";
      import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
try {
await connectionDb();
const { name, email, password } = await request.json();
const existEmail = await User.findOne({ email });
if (existEmail) {
return NextResponse.json(
{ message: "this is email is already exists" },
{ status: 400 },
);
}
if (password.length < 6) {
return NextResponse.json(
{ message: "password must be atleast 6 character" },
{ status: 400 },
);
}
const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    return NextResponse.json(
      { message: "user created successfully", user },
      { status: 201 },
    );

} catch (error) {
return NextResponse.json(
{ message: "error come from register API", error },
{ status: 500 },
);
}
}

4. next-auth
   installation-> npm i next-auth
   /api/auth/[...nextauth]/route.ts
   import authOption from "@/lib/auth";
   import NextAuth from "next-auth";

const handler = NextAuth(authOption);

export { handler as GET, handler as POST };

/src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectionDb } from "./db";
import { User } from "@/model/user.model";
import bcrypt from "bcryptjs";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
interface Session {
user: {
id: string;
} & DefaultSession["user"];
}
}
export const authOption: NextAuthOptions = {
// Providers: login ke methods define karne ke liye
providers: [
CredentialsProvider({
name: "Credentials",
credentials: {
email: { label: "Email", type: "email" },
password: { label: "Password", type: "password" },
},
async authorize(credentials) {
const email = credentials?.email;
const password = credentials?.password;

        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        // Database connect karein
        await connectionDb();

        // User dhundein
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
          throw new Error("User not found, please register first");
        }

        // Password compare karein
        const isMatchPassword = await bcrypt.compare(
          password,
          existingUser.password,
        );
        if (!isMatchPassword) {
          throw new Error("Invalid password");
        }

        // NextAuth ko string format mein ID chahiye hoti hai
        return {
          id: existingUser._id.toString(),
          email: existingUser.email,
          name: existingUser.name,
          image: existingUser.image,
        };
      },
    }),

],

// Callbacks: Token aur Session manage karne ke liye
callbacks: {
// 1. Authorize se data pehle JWT token mein aata hai
async jwt({ token, user }) {
if (user) {
token.id = user.id;
token.name = user.name;
token.email = user.email;
token.image = user.image;
}
return token;
},

    // 2. JWT token se data Session object mein jata hai
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image as string;
      }
      return session;
    },

},

// Custom login/error pages ke liye (abhi empty hai)
pages: {
signIn: "/login",
error: "/login",
},
// Session strategy define karna zaroori hai credentials ke liye
session: {
strategy: "jwt",
maxAge: 30 _ 24 _ 60 _ 60 _ 1000,
},

// Environment variable se secret uthayein
secret: process.env.NEXTAUTH_SECRET,
};

export default authOption;

5. creating register and login page in frontend

/src/app/register/page.tsx
"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
const Register = () => {
const router = useRouter();
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
e.preventDefault();
try {
const response = await axios.post("/api/auth/register", {
name,
email,
password,
});
console.log(response);
} catch (error) {
console.log(error);
}
};
return (

<div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-slate-900 to-black text-gray-100 flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans selection:bg-amber-200 selection:text-black">
<div className="w-full max-w-md md:max-w-[500px] h-auto p-6 sm:p-8 md:p-10 border border-gray-800 bg-gray-900/40 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col transition-all duration-300 hover:border-gray-700/80">
<form className="space-y-5" onSubmit={handleOnSubmit}>
<div className="text-center space-y-1 md:space-y-2">
<h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-amber-50 to-gray-200 bg-clip-text text-transparent uppercase">
Create Account
</h1>
</div>

          {/* Name Field */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold tracking-wide text-gray-300 ml-0.5">
              Full Name
            </label>
            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setName(e.target.value);
              }}
              value={name}
              className="bg-gray-950/60 border border-gray-800 focus:border-amber-200 text-sm sm:text-base px-4 py-2.5 sm:py-3 w-full rounded-xl outline-none text-white placeholder-gray-600 transition-all duration-200 shadow-inner"
              type="text"
              placeholder="Enter name"
              required
            />
          </div>

          {/* Email Field */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold tracking-wide text-gray-300 ml-0.5">
              Email Address
            </label>
            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
              }}
              value={email}
              className="bg-gray-950/60 border border-gray-800 focus:border-amber-200 text-sm sm:text-base px-4 py-2.5 sm:py-3 w-full rounded-xl outline-none text-white placeholder-gray-600 transition-all duration-200 shadow-inner"
              type="email"
              placeholder="name@example.com"
              required
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold tracking-wide text-gray-300 ml-0.5">
              Password
            </label>
            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value);
              }}
              value={password}
              className="bg-gray-950/60 border border-gray-800 focus:border-amber-200 text-sm sm:text-base px-4 py-2.5 sm:py-3 w-full rounded-xl outline-none text-white placeholder-gray-600 transition-all duration-200 shadow-inner"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Route redirect statement */}
          <p className="pt-1 text-center text-xs sm:text-sm text-gray-400 font-medium">
            Already have an account?
            <span
              onClick={() => {
                router.push("/login");
              }}
              className="text-amber-200 hover:text-amber-100 font-semibold underline underline-offset-4 cursor-pointer ml-1.5 transition-colors duration-200"
            >
              Log in
            </span>
          </p>

          {/* Primary Submit Button */}
          <button
            type="submit"
            className="w-full bg-amber-50 hover:bg-amber-100 active:scale-[0.98] text-black font-bold text-sm sm:text-base py-3 sm:py-3.5 rounded-xl shadow-lg shadow-amber-950/20 transition-all duration-200 ease-out cursor-pointer"
          >
            Register
          </button>

          {/* Divider Segment */}
          <div className="w-full flex items-center gap-3 py-1">
            <hr className="w-full border-gray-800/80" />
            <span className="text-gray-500 text-xxs sm:text-xs font-bold tracking-widest uppercase shrink-0">
              OR
            </span>
            <hr className="w-full border-gray-800/80" />
          </div>
        </form>
        {/* Secondary OAuth Button */}
        <button
          type="button"
          className="w-full bg-gray-950 hover:bg-gray-900 border border-gray-800 hover:border-gray-700 active:scale-[0.98] text-gray-200 font-semibold text-sm sm:text-base py-3 sm:py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer"
        >
          {/* Minimal SVG Google Icon */}
          <FcGoogle size={20} />
          Continue with Google
        </button>
      </div>
    </div>

);
};

export default Register;

/src/app/login/page.tsx
"use client";
import axios from "axios";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
const Login = () => {
const router = useRouter();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
e.preventDefault();
try {
// 1. redirect: false lagane se next-auth automatic full page crash/reload nahi karega
const response = await signIn("credentials", {
email,
password,
redirect: false,
});

      const session = await getSession();
      console.log("Aapka User Data Yeh Hai:", session?.user);
    } catch (error) {
      console.log("Client Login Crash:", error);
    }

};

return (

<div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-slate-900 to-black text-gray-100 flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans selection:bg-amber-200 selection:text-black">
<div className="w-full max-w-md md:max-w-[500px] h-auto p-6 sm:p-8 md:p-10 border border-gray-800 bg-gray-900/40 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col transition-all duration-300 hover:border-gray-700/80">
<form className="space-y-5" onSubmit={handleSignIn}>
<div className="text-center space-y-1 md:space-y-2">
<h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-amber-50 to-gray-200 bg-clip-text text-transparent uppercase">
Login
</h1>
</div>

          {/* Email Field */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold tracking-wide text-gray-300 ml-0.5">
              Email Address
            </label>
            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
              }}
              value={email}
              className="bg-gray-950/60 border border-gray-800 focus:border-amber-200 text-sm sm:text-base px-4 py-2.5 sm:py-3 w-full rounded-xl outline-none text-white placeholder-gray-600 transition-all duration-200 shadow-inner"
              type="email"
              placeholder="name@example.com"
              required
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold tracking-wide text-gray-300 ml-0.5">
              Password
            </label>
            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value);
              }}
              value={password}
              className="bg-gray-950/60 border border-gray-800 focus:border-amber-200 text-sm sm:text-base px-4 py-2.5 sm:py-3 w-full rounded-xl outline-none text-white placeholder-gray-600 transition-all duration-200 shadow-inner"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Route redirect statement */}
          <p className="pt-1 text-center text-xs sm:text-sm text-gray-400 font-medium">
            create an account?
            <span
              onClick={() => {
                router.push("/register");
              }}
              className="text-amber-200 hover:text-amber-100 font-semibold underline underline-offset-4 cursor-pointer ml-1.5 transition-colors duration-200"
            >
              sign up
            </span>
          </p>

          {/* Primary Submit Button */}
          <button
            type="submit"
            className="w-full bg-amber-50 hover:bg-amber-100 active:scale-[0.98] text-black font-bold text-sm sm:text-base py-3 sm:py-3.5 rounded-xl shadow-lg shadow-amber-950/20 transition-all duration-200 ease-out cursor-pointer"
          >
            Login
          </button>

          {/* Divider Segment */}
          <div className="w-full flex items-center gap-3 py-1">
            <hr className="w-full border-gray-800/80" />
            <span className="text-gray-500 text-xxs sm:text-xs font-bold tracking-widest uppercase shrink-0">
              OR
            </span>
            <hr className="w-full border-gray-800/80" />
          </div>
        </form>
        {/* Secondary OAuth Button */}
        <button
          type="button"
          className="w-full bg-gray-950 hover:bg-gray-900 border border-gray-800 hover:border-gray-700 active:scale-[0.98] text-gray-200 font-semibold text-sm sm:text-base py-3 sm:py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer"
        >
          {/* Minimal SVG Google Icon */}
          <FcGoogle size={20} />
          Continue with Google
        </button>
      </div>
    </div>

);
};

export default Login;

/src/ClientProvider.tsx
"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";

const ClientProvider = ({ children }: { children: React.ReactNode }) => {
return (

<div>
<SessionProvider>{children}</SessionProvider>
</div>
)
}

export default ClientProvider

6. google authentication
   sabse pehle hum google console cloud main jaaiyenge
   phir api& service main
   phir credential ko select karenge
   aur sabse top main create credential main click karenge
   phir option aayega bohat sara humko oauthClientId select karenge
   phir application type main denge web appliaction
   name mainn kuch bhi de skte hai isme hum next_project karke diye hai
   authorized redirect url main yeh likhenge http://localhost:3000/api/auth/callback/google
   phir create main click karenge
   phir humko clientId Aur clientSecret mil jaiyega usko .env main dhaal denge

yeh hone ke baad hum

auth.ts main jaiyenge

provider main yeh likhayega

Google({
clientId: process.env.GOOGLE_CLIENT_ID as string,
clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
}),

callback
callbacks: {
async signIn({ account, user }) {
if (account?.provider === "google") {
await connectionDb();
let existingUser = await User.findOne({ email: user.email });
if (!existingUser) {
existingUser = await User.create({
name: user?.name,
email: user?.email,
});
}
user.id = existingUser.\_id.toString();
}
return true;
},}

/src/app/login/page.tsx main button
<button
onClick={() => {
signIn("google", {
callbackUrl: "/",
redirect: false,
});
}}
type="button"
className="w-full bg-gray-950 hover:bg-gray-900 border border-gray-800 hover:border-gray-700 active:scale-[0.98] text-gray-200 font-semibold text-sm sm:text-base py-3 sm:py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer" >
{/_ Minimal SVG Google Icon _/}
<FcGoogle size={20} />
Continue with Google
</button>
same as it is register.tsx


7. home page creation and logout
"use client";

import { signOut, useSession } from "next-auth/react";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { HiPencilAlt } from "react-icons/hi";
import { FaRegUserCircle } from "react-icons/fa";

const ProfilePage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut({ callbackUrl: "/login" });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 1. Session Load ho raha hai
  if (status === "loading") {
    return (
      <div className="bg-gray-950 h-screen w-full text-white flex justify-center items-center">
        <div className="text-xl font-medium animate-pulse">
          Loading profile...
        </div>
      </div>
    );
  }

  // 2. User login nahi hai
  if (status === "unauthenticated") {
    return (
      <div className="bg-gray-950 h-screen w-full text-white flex flex-col justify-center items-center gap-4">
        <p className="text-lg text-gray-400">You are not logged in.</p>
        <button
          onClick={() => router.push("/login")}
          className="bg-amber-400 text-black font-semibold px-6 py-2.5 rounded-xl hover:bg-amber-300 transition-colors cursor-pointer"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const user = session?.user;

  // 3. Authenticated User Profile UI
  return (
    <div className="bg-gray-950 min-h-screen w-full text-white flex flex-col justify-center items-center p-4">
      {/* Added 'relative' here so the absolute edit icon stays pinned to the card */}
      <div className="relative w-full max-w-md p-8 border border-gray-800 bg-gray-900/40 backdrop-blur-xl rounded-2xl flex flex-col items-center shadow-2xl">
        
        {/* Edit Icon Button */}
        <button
          type="button"
          onClick={() => router.push("/edit")}
          className="absolute top-5 right-5 bg-amber-200 hover:bg-amber-100 text-gray-950 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-transform duration-150 active:scale-90 shadow-md"
          title="Edit Profile"
        >
          <HiPencilAlt size={18} />
        </button>

        {/* User Avatar */}
        {user?.image ? (
          <div className="relative h-28 w-28 border-2 border-amber-200/50 rounded-full overflow-hidden shadow-lg">
            <Image
              src={user.image}
              alt={user.name || "User Avatar"}
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : (
          <div className="h-28 w-28 border-2 border-amber-200/50 rounded-full bg-gray-800 flex items-center justify-center text-3xl font-bold text-amber-200">
            <FaRegUserCircle size={64} className="text-gray-600" />
          </div>
        )}

        {/* User Details */}
        <h1 className="text-2xl pt-4 font-bold text-amber-200">
          {user?.name || "User"}
        </h1>
        <h2 className="text-sm pt-1 text-gray-400">{user?.email}</h2>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold px-8 py-2.5 rounded-xl mt-6 transition-all duration-200 cursor-pointer shadow-md active:scale-95"
        >
          {loading ? "Signing out..." : "Logout"}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;

8. create edit page
"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import Image from "next/image";

const EditPage = () => {
  const { data } = useSession();
  const [name, setName] = useState("");
  const [frontEndImage, setFrontEndImage] = useState("");
  const [backEndImage, setBackEndImage] = useState<File | null>(null);
  const imageInput = useRef<HTMLInputElement>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Fixed condition check
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setBackEndImage(file);
    setFrontEndImage(URL.createObjectURL(file));
  };

  useEffect(() => {
    if (data?.user) {
      setName(data?.user?.name || "");
      setFrontEndImage(data?.user?.image || "");
    }
  }, [data]);

  return (
    <div className="bg-gray-950 min-h-screen w-full flex justify-center items-center p-4">
      <div className="bg-gray-900 w-full max-w-md px-8 py-10 border border-gray-800 rounded-2xl shadow-xl flex flex-col items-center">
        <h1 className="text-2xl font-bold text-white capitalize tracking-wide">
          Edit Profile
        </h1>

        <form className="w-full flex justify-center flex-col gap-5 items-center">
          {/* Added onChange handler */}
          <input
            type="file"
            accept="image/*"
            hidden
            ref={imageInput}
            onChange={handleImage}
          />

          {/* Avatar / Upload Trigger */}
          {frontEndImage ? (
            <div
              onClick={() => imageInput.current?.click()}
              className="cursor-pointer relative h-28 w-28 border-2 border-amber-200/50 rounded-full overflow-hidden shadow-lg mt-2 group"
              title="Click to change photo"
            >
              <Image
                src={frontEndImage}
                alt={name || "User Avatar"}
                fill
                className="object-cover group-hover:opacity-80 transition-opacity"
                priority
              />
            </div>
          ) : (
            <div
              onClick={() => imageInput.current?.click()}
              className="cursor-pointer h-28 w-28 mt-2 border-2 border-amber-200/50 rounded-full bg-gray-800 flex items-center justify-center text-3xl font-bold text-amber-200 hover:bg-gray-700 transition-colors"
              title="Click to upload photo"
            >
              <FaRegUserCircle size={64} className="text-gray-400" />
            </div>
          )}

          <div className="w-full flex flex-col space-y-1.5 mt-2">
            <label className="text-xs sm:text-sm font-semibold tracking-wide text-gray-300 ml-0.5">
              Full Name
            </label>
            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setName(e.target.value);
              }}
              value={name}
              className="bg-gray-950/60 border border-gray-800 focus:border-amber-200 text-sm sm:text-base px-4 py-2.5 sm:py-3 w-full rounded-xl outline-none text-white placeholder-gray-600 transition-all duration-200 shadow-inner"
              type="text"
              placeholder="Enter name"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-400 text-black font-semibold px-6 py-2.5 rounded-xl hover:bg-amber-300 transition-colors cursor-pointer active:scale-98"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPage;

9. image upload using cloudinary
/src/lib/cloudinary.ts

import { Buffer } from "buffer";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const uploadOnCloudinary = async (
  file: Blob | File
): Promise<string | null> => {
  if (!file) {
    return null;
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return await new Promise<string | null>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "next-project",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            resolve(null); // reject ke bajaye resolve(null) karein taaki route crash na ho
          } else if (result?.secure_url) {
            resolve(result.secure_url);
          } else {
            resolve(null);
          }
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error("Buffer Conversion Error:", error);
    return null;
  }
};

10. create edit api
/src/api/edit/route.ts

import authOption from "@/lib/auth";
import { uploadOnCloudinary } from "@/lib/cloudinary";
import { connectionDb } from "@/lib/db";
import { User } from "@/model/user.model";
import { getServerSession } from "next-auth";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
 try {
     await connectionDb();

  const session = await getServerSession(authOption);
  if (!session || !session.user?.email) {
    return NextResponse.json(
      { message: "unauthorized" },
      { status: 401 }
    );
  }

  const formData = await req.formData();
  const name = formData.get("name") as string;
  const file = formData.get("file") as Blob | null;

  let imageUrl = session.user.image ?? null;

  if (file && file.size > 0) {
    imageUrl = await uploadOnCloudinary(file);
  }

  const user = await User.findByIdAndUpdate(
    session.user.id,
    {
      name,
      image: imageUrl,
    },
    { new: true }
  );

  if (!user) {
    return NextResponse.json(
      { message: "user not updated" },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      message: "user updated successfully",
      user,
    },
    { status: 200 }
  );
 } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
 }
}

11. creating get user api
/src/api/user/route.ts

import authOption from "@/lib/auth";
import { connectionDb } from "@/lib/db";
import { User } from "@/model/user.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectionDb();
    const session = await getServerSession(authOption);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const user = await User.findById(session.user.id).select("-password");
    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "user found", user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "user server error" },
      { status: 500 },
    );
  }
}
