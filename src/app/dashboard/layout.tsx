"use client";

import NavbarSidebarLayout from "@/src/app/dashboard/components/navbar-sidebar";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/src/locale/en.json";
import { DarkThemeWrapper } from "./DarkThemeWrapper";
import { AuthProvider } from "../providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <DarkThemeWrapper>
        <NextIntlClientProvider
          timeZone={"America/New_York"}
          locale={"en"}
          messages={messages}
        >
          <NavbarSidebarLayout isFooter={false}>
            <div className="mb-5 px-4 pt-6">{children}</div>
          </NavbarSidebarLayout>
        </NextIntlClientProvider>
      </DarkThemeWrapper>
    </AuthProvider>
  );
}
