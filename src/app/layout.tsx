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
        <body className={`font-jones h-screen bg-[#002341]`}>{children};</body>
      </html>
    </Providers>
  );
}
