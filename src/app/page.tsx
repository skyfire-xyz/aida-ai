"use client";

import Header from "./components/Header";
import AiChat from "./components/AiChat";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/src/locale/en.json";

export default function Home() {
  return (
    <NextIntlClientProvider
      timeZone={"America/New_York"}
      locale={"en"}
      messages={messages}
    >
      <div className="h-[calc(100%-220px)] md:h-[calc(100%-200px)]">
        <Header />
        <AiChat images={[]} />
      </div>
    </NextIntlClientProvider>
  );
}
