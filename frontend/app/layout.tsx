import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ST Ai - Next-Gen Dual-Engine AI Platform",
  description: "Experience ultra-fast conversational intelligence powered by Gemini & Groq.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#070514] text-neutral-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
