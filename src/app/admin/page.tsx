"use client";

import { NextIntlClientProvider } from "next-intl";
import messages from "@/src/locale/en.json";
import Sidebar from "@/src/common/components/Sidebar";
import WalletManager from "./Admin/WalletManager/WalletManager";

export default async function AdminPage() {
  return (
    <NextIntlClientProvider
      timeZone={"America/New_York"}
      locale={"en"}
      messages={messages}
    >
      <div className="flex h-full p-1">
        <Sidebar />
        <div className="shadow-lg h-full w-screen rounded-lg bg-white max-w-[none] mt-6 mb-6">
          <div className="flex h-full w-full rounded-lg my-10 p-20">
            <WalletManager />
          </div>
        </div>
      </div>
    </NextIntlClientProvider>
  );
}
