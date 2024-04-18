"use client";

import NavbarSidebarLayout from "@/src/app/dashboard/components/navbar-sidebar";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/src/locale/en.json";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextIntlClientProvider
      timeZone={"America/New_York"}
      locale={"en"}
      messages={messages}
    >
      <NavbarSidebarLayout isFooter={false}>
        <div className="mb-5 px-4 pt-6">
          {children}
          {/* <SalesThisWeek />
        <div className="my-6">
          <LatestTransactions />
        </div>
        <LatestCustomers />
        <div className="my-6">
          <AcquisitionOverview />
        </div> */}
        </div>
      </NavbarSidebarLayout>
    </NextIntlClientProvider>
  );
}
