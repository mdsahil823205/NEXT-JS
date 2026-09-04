"use client";

import { useSession } from "next-auth/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { userDataContext } from "@/context/userContext";

const EditPage = () => {
  const router = useRouter();
  const { update } = useSession();
  const ctx = useContext(userDataContext);
  const [name, setName] = useState("");
  const [frontEndImage, setFrontEndImage] = useState("");
  const [backEndImage, setBackEndImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const imageInput = useRef<HTMLInputElement>(null);

  const HandleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setBackEndImage(file);
    setFrontEndImage(URL.createObjectURL(file));
    setErrorMsg("");
  };

  useEffect(() => {
    if (ctx?.user) {
      setName(ctx.user.name || "");
      setFrontEndImage(ctx.user.image || "");
    }
  }, [ctx?.user]);

  const HandleImageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const formdata = new FormData();
      formdata.append("name", name);
      if (backEndImage) {
        formdata.append("file", backEndImage);
      }
      const result = await axios.post("/api/edit", formdata);

      if (result.status === 200 && result.data.user) {
        // Update NextAuth session
        await update({
          name: result.data.user.name,
          image: result.data.user.image,
        });
        // Immediately sync local UserContext state
        if (ctx?.setUser) {
          ctx.setUser(result.data.user);
        }
        await ctx?.refetchUser();
        router.push("/");
      }
    } catch (error: any) {
      console.error("Profile update error:", error);
      setErrorMsg(
        error?.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen w-full flex justify-center items-center p-4">
      <div className="bg-gray-900 w-full max-w-md px-8 py-10 border border-gray-800 rounded-2xl shadow-xl flex flex-col items-center">
        <h1 className="text-2xl font-bold text-white capitalize tracking-wide">
          Edit Profile
        </h1>

        {errorMsg && (
          <div className="w-full mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs sm:text-sm text-center">
            {errorMsg}
          </div>
        )}

        <form
          className="w-full flex justify-center flex-col gap-5 items-center mt-2"
          onSubmit={HandleImageSubmit}
        >
          <input
            type="file"
            accept="image/*"
            hidden
            ref={imageInput}
            onChange={HandleImageChange}
            disabled={loading}
          />

          {/* Avatar / Upload Trigger */}
          {frontEndImage ? (
            <div
              onClick={() => !loading && imageInput.current?.click()}
              className={`cursor-pointer relative h-28 w-28 border-2 border-amber-200/50 rounded-full overflow-hidden shadow-lg mt-2 group ${
                loading ? "opacity-60 pointer-events-none" : ""
              }`}
              title="Click to change photo"
            >
              <Image
                src={frontEndImage}
                alt={name || "User Avatar"}
                fill
                sizes="112px"
                className="object-cover group-hover:opacity-80 transition-opacity"
                priority
              />
            </div>
          ) : (
            <div
              onClick={() => !loading && imageInput.current?.click()}
              className={`cursor-pointer h-28 w-28 mt-2 border-2 border-amber-200/50 rounded-full bg-gray-800 flex items-center justify-center text-3xl font-bold text-amber-200 hover:bg-gray-700 transition-colors ${
                loading ? "opacity-60 pointer-events-none" : ""
              }`}
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
              disabled={loading}
              className="bg-gray-950/60 border border-gray-800 focus:border-amber-200 text-sm sm:text-base px-4 py-2.5 sm:py-3 w-full rounded-xl outline-none text-white placeholder-gray-600 transition-all duration-200 shadow-inner disabled:opacity-50"
              type="text"
              placeholder="Enter full name"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-400 text-black font-semibold px-6 py-2.5 rounded-xl hover:bg-amber-300 transition-colors cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving & Uploading..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPage;
