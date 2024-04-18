"use client";

import { NextIntlClientProvider } from "next-intl";
import messages from "@/src/locale/en.json";
import Sidebar from "@/src/common/components/OldSidebar";
import WalletManager from "./Admin/WalletManager/WalletManager";
import { useEffect, useState } from "react";

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
          <div className="my-10 flex h-full w-full rounded-lg p-20">
            <WalletManager />
          </div>
        </div>
      </div>
    </NextIntlClientProvider>
  );
}
