import type { Metadata } from "next";
import "@/src/globals.css";

export const metadata: Metadata = {
  title: "AA Wallet(Zerodev) with passkey authentication",
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
    <html lang="en">
      <body className={`h-screen bg-[#002341] font-jones`}>{children}</body>
    </html>
  );
}
