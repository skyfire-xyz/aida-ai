"use client";
import { Provider } from "react-redux";
import { store } from "@/src/store";
import messages from "@/src/locale/en.json";
import { NextIntlClientProvider } from "next-intl";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <NextIntlClientProvider
        timeZone={"America/New_York"}
        locale={"en"}
        messages={messages}
      >
        {children}
      </NextIntlClientProvider>
    </Provider>
  );
}
