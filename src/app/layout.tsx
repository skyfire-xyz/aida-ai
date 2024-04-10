import type { Metadata } from "next";
import "@/src/globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Aida.AI - Powered by Supermojo Payments",
  description: "",
};

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <Providers>
      <html lang="en">
        <body className={`h-screen bg-[#002341] font-jones`}>{children};</body>
      </html>
    </Providers>
  );
}
