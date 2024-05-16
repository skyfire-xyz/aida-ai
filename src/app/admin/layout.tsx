"use client";

import { NextIntlClientProvider } from "next-intl";
import messages from "@/src/locale/en.json";
import { AuthProvider } from "../providers";
import { DarkThemeWrapper } from "../dashboard/DarkThemeWrapper";
import NavbarSidebarLayout from "../dashboard/components/navbar-sidebar";

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
