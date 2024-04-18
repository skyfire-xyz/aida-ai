"use client";

import { NextIntlClientProvider } from "next-intl";
import messages from "@/src/locale/en.json";
import Sidebar from "@/src/common/components/OldSidebar";
import WalletManager from "./Admin/WalletManager/WalletManager";
import { useEffect, useState } from "react";
import PaymentTransactions from "./Admin/WalletManager/PaymentTransactions";

export default function AdminPage() {
  return (
    <NextIntlClientProvider
      timeZone={"America/New_York"}
      locale={"en"}
      messages={messages}
    >
      <div className="flex h-full p-1">
        <Sidebar />
        <div className="mb-6 mt-6 h-full w-screen max-w-[none] rounded-lg bg-white shadow-lg">
          <WalletManager />
        </div>
      </div>
    </NextIntlClientProvider>
  );
}
