"use client";

import NavbarSidebarLayout from "@/src/app/dashboard/components/navbar-sidebar";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/src/locale/en.json";
import { DarkThemeWrapper } from "../dashboard/DarkThemeWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser, useAuthSelector } from "../reducers/authentication";
import { AppDispatch } from "@/src/store";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useSelector(useAuthSelector);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getUser());
  }, []);
  useEffect(() => {
    if (auth.init && auth.user) {
      router.push("/dashboard");
    }
  }, [auth]);

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
