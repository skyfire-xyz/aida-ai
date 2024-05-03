"use client";

import NavbarSidebarLayout from "@/src/app/dashboard/components/navbar-sidebar";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/src/locale/en.json";
import { DarkThemeWrapper } from "../dashboard/DarkThemeWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DarkThemeWrapper>
      <NextIntlClientProvider
        timeZone={"America/New_York"}
        locale={"en"}
        messages={messages}
      >
        {children}
      </NextIntlClientProvider>
    </DarkThemeWrapper>
  );
}
