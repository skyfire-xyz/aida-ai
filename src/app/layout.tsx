import type { Metadata } from "next";
import "@/src/globals.css";
import { AuthProvider, Providers } from "./providers";
import { Flowbite, ThemeModeScript } from "flowbite-react";
import theme from "@/src/common/flowbite-theme";
import { useSelector } from "react-redux";
import { useAuthSelector } from "./reducers/authentication";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

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
        <head>
          <ThemeModeScript />
        </head>
        <body className="bg-gray-50 dark:bg-gray-900">
          <Flowbite theme={{ theme }}>
            <div id="root">{children}</div>
          </Flowbite>
        </body>
      </html>
    </Providers>
  );
}
