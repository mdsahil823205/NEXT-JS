"use client";

import { signOut, useSession } from "next-auth/react";
import React, { useState, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { HiPencilAlt } from "react-icons/hi";
import { FaRegUserCircle } from "react-icons/fa";
import { userDataContext } from "@/context/userContext";

const ProfilePage = () => {
  const router = useRouter();
  const { status } = useSession();
  const data = useContext(userDataContext);
  const user = data?.user;
  const [loading, setLoading] = useState(false);

  const HandleSignOut = async () => {
    setLoading(true);
    try {
      await signOut({ callbackUrl: "/login" });
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  // 1. Unauthenticated state
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

  // 2. Loading profile state
  if (status === "loading" || !user) {
    return (
      <div className="bg-gray-950 h-screen w-full text-white flex justify-center items-center">
        <div className="text-xl font-medium animate-pulse">
          Loading profile...
        </div>
      </div>
    );
  }

  // 3. Authenticated User Profile UI
  return (
    <div className="bg-gray-950 min-h-screen w-full text-white flex flex-col justify-center items-center p-4">
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
              sizes="112px"
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
          onClick={HandleSignOut}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold px-8 py-2.5 rounded-xl mt-6 transition-all duration-200 cursor-pointer shadow-md active:scale-95"
        >
          {loading ? "Signing out..." : "Log Out"}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;