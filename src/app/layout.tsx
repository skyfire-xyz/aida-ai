import type { Metadata } from "next";
import "@/src/globals.css";

export const metadata: Metadata = {
  title: "Supermojo Passkey Demo",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`h-screen bg-[#002341] font-jones`}>{children}</body>
    </html>
  );
}