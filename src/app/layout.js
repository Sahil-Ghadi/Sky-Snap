import { Geist, Geist_Mono,Orbitron } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sky Snap",
  description: "Interactive space exploration app that lets you track satellites, explore stars, view missions, and test your space knowledge.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950`}
      >
        <Navbar />
        <main className="pt-16"></main>
        {children}
      </body>
    </html>
  );
}
