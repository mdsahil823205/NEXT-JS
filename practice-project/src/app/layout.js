import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap"
})

export const metadata = {
  title: "travel agent page",
  description: "this is the best travel agent for travelling"
}

export default function RootLayout({ children }) {
  return (
    // 1. html tag ko bilkul simple aur clean rakhein
    <html lang="en" suppressHydrationWarning={true}>
      
      {/* 2. Saare fonts aur tailwind styles ko html se hata kar body par shift karein */}
      <body className={`${poppins.className} min-h-full flex flex-col h-screen w-full bg-gray-800 text-white`}>
        <Navbar />
        {children}
      </body>
      
    </html>
  );
}
