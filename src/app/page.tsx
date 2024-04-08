"use client";

import Header from "./components/AiChat/Header";
import AiChat from "./components/AiChat/AiChat";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/src/locale/en.json";

export default async function Home() {
  return (
    <NextIntlClientProvider
      timeZone={"America/New_York"}
      locale={"en"}
      messages={messages}
    >
      <div className="md:h-[calc(100%-200px)] h-[calc(100%-220px)]">
        <Header />
        <AiChat images={[]} />
      </div>
    </NextIntlClientProvider>
  );
}
