import type { Metadata } from "next";
import "@/src/globals.css";
import { Providers } from "./providers";
import { Flowbite } from "flowbite-react";
import theme from "@/src/common/flowbite-theme";

export const metadata: Metadata = {
  title: "Aida.AI - Powered by Skyfire Payments",
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
        <body className="bg-gray-50">
          <Flowbite theme={{ theme }}>
            <div id="root">{children}</div>
          </Flowbite>
        </body>
      </html>
    </Providers>
  );
}
