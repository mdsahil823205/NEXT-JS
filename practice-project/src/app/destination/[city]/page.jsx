"use client";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";

// Images import
import parisImage from "@/assets/Paris.webp";
import tokyoImage from "@/assets/tokyo.jpg";
import newYorkImage from "@/assets/newyork.jpeg";

const Page = () => {
  const params = useParams();
  const router = useRouter();

  // URL se city ka naam nikalna (Agar folder ka naam [id] hai toh params.id likhein)
  const cityName = params.city || ""; 
  console.log(cityName)
  return (
    <div className="p-10 text-white">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">{cityName}</h1>
        <button onClick={() => router.back()} className="bg-gray-600 p-3 rounded-lg">
          Back
        </button>
      </div>

      {/* Main Box */}
      <div className="flex gap-5">
        {/* Left Side: Image */}
        <div className="w-[50%] h-[400px] bg-gray-800 flex items-center justify-center rounded">
          {cityName === "Paris" && <Image src={parisImage} alt="Paris" className="w-full h-full object-cover" />}
          {cityName === "Tokyo" && <Image src={tokyoImage} alt="Tokyo" className="w-full h-full object-cover" />}
          {cityName === "NewYork" && <Image src={newYorkImage} alt="New York" className="w-full h-full object-cover" />}
        </div>

        {/* Right Side: Description */}
        <div className="w-[50%] h-[400px] bg-blue-600 p-10 rounded text-2xl">
          Welcome to {cityName}! Here is the live description.
        </div>
      </div>
    </div>
  );
};

export default Page;
