"use client";

import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiAlertCircle, FiEye, FiEyeOff } from "react-icons/fi";
import { userDataContext } from "@/context/userContext";

const Register = () => {
  const router = useRouter();
  const { status } = useSession();
  const ctx = useContext(userDataContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Redirect authenticated users to home page automatically
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  const HandleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (response.status === 201) {
        // Automatically sign in upon successful registration
        const loginRes = await signIn("credentials", {
          email: email.trim(),
          password,
          redirect: false,
        });

        if (loginRes?.ok) {
          if (ctx?.refetchUser) {
            await ctx.refetchUser();
          }
          router.push("/");
          router.refresh();
        } else {
          router.push("/login");
        }
      }
    } catch (error: any) {
      console.error("Registration process error:", error);
      const backendMsg = error?.response?.data?.message;
      if (backendMsg && backendMsg.toLowerCase().includes("already")) {
        setErrorMsg("This email address is already registered. Please log in instead.");
      } else if (backendMsg) {
        setErrorMsg(backendMsg);
      } else {
        setErrorMsg("Failed to create account. Please check your network and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const HandleGoogleSignIn = () => {
    setGoogleLoading(true);
    setErrorMsg("");
    signIn("google", {
      callbackUrl: "/",
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-slate-900 to-black text-gray-100 flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans selection:bg-amber-200 selection:text-black">
      <div className="w-full max-w-md md:max-w-[480px] h-auto p-6 sm:p-8 md:p-10 border border-gray-800 bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col transition-all duration-300">
        
        {/* Header */}
        <div className="text-center space-y-1.5 mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-amber-50 to-gray-200 bg-clip-text text-transparent uppercase">
            Create Account
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Join us today! Enter your details to get started.
          </p>
        </div>

        {/* Warning / Error Alert Banner */}
        {errorMsg && (
          <div className="w-full mb-5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2.5 text-red-400 text-xs sm:text-sm animate-in fade-in slide-in-from-top-2 duration-200">
            <FiAlertCircle className="shrink-0 text-base sm:text-lg mt-0.5 text-red-400" />
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={HandleRegisterSubmit}>
          {/* Name Field */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold tracking-wide text-gray-300 ml-0.5">
              Full Name
            </label>
            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setName(e.target.value);
                setErrorMsg("");
              }}
              value={name}
              disabled={loading || googleLoading}
              className="bg-gray-950/60 border border-gray-800 focus:border-amber-200 text-sm sm:text-base px-4 py-2.5 sm:py-3 w-full rounded-xl outline-none text-white placeholder-gray-600 transition-all duration-200 shadow-inner disabled:opacity-50"
              type="text"
              placeholder="Your full name"
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
                setErrorMsg("");
              }}
              value={email}
              disabled={loading || googleLoading}
              className="bg-gray-950/60 border border-gray-800 focus:border-amber-200 text-sm sm:text-base px-4 py-2.5 sm:py-3 w-full rounded-xl outline-none text-white placeholder-gray-600 transition-all duration-200 shadow-inner disabled:opacity-50"
              type="email"
              placeholder="name@example.com"
              required
            />
          </div>

          {/* Password Field with Show/Hide Toggle */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold tracking-wide text-gray-300 ml-0.5">
              Password (min. 6 characters)
            </label>
            <div className="relative w-full">
              <input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                  setErrorMsg("");
                }}
                value={password}
                disabled={loading || googleLoading}
                className="bg-gray-950/60 border border-gray-800 focus:border-amber-200 text-sm sm:text-base px-4 py-2.5 sm:py-3 pr-11 w-full rounded-xl outline-none text-white placeholder-gray-600 transition-all duration-200 shadow-inner disabled:opacity-50"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-200 transition-colors cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* Route redirect statement */}
          <p className="pt-1 text-center text-xs sm:text-sm text-gray-400 font-medium">
            Already have an account?
            <span
              onClick={() => {
                if (!loading) router.push("/login");
              }}
              className="text-amber-200 hover:text-amber-100 font-semibold underline underline-offset-4 cursor-pointer ml-1.5 transition-colors duration-200"
            >
              Log in
            </span>
          </p>

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-gray-950 font-bold text-sm sm:text-base py-3 sm:py-3.5 rounded-xl shadow-lg shadow-amber-950/20 transition-all duration-200 ease-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin"></span>
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Register</span>
            )}
          </button>

          {/* Divider Segment */}
          <div className="w-full flex items-center gap-3 py-1">
            <hr className="w-full border-gray-800/80" />
            <span className="text-gray-500 text-xs font-bold tracking-widest uppercase shrink-0">
              OR
            </span>
            <hr className="w-full border-gray-800/80" />
          </div>
        </form>

        {/* Google OAuth Button */}
        <button
          onClick={HandleGoogleSignIn}
          disabled={loading || googleLoading}
          type="button"
          className="w-full bg-gray-950 hover:bg-gray-900 border border-gray-800 hover:border-gray-700 active:scale-[0.98] text-gray-200 font-semibold text-sm sm:text-base py-3 sm:py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-1"
        >
          {googleLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-gray-200 border-t-transparent rounded-full animate-spin"></span>
              <span>Connecting to Google...</span>
            </>
          ) : (
            <>
              <FcGoogle size={20} />
              <span>Continue with Google</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Register;
