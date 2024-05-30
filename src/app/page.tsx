"use client";

import Header from "./components/Header";
import AiChat from "./components/AiChat";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/src/locale/en.json";
import Signup from "./components/Signup";
import { useDispatch, useSelector } from "react-redux";
import { getUser, useAuthSelector } from "./reducers/authentication";
import { useEffect, useMemo, useState } from "react";
import { AppDispatch } from "../store";
import { SKYFIRE_API_KEY } from "../common/lib/constant";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector(useAuthSelector);
  const [showSignInModal, setShowSignInModal] = useState(true);


  useEffect(() => {
    setShowSignInModal(!SKYFIRE_API_KEY);
  }, [auth]);

  useEffect(() => {
    dispatch(getUser());
  }, []);

  return (
    <div
      className={`font-jones h-screen bg-gradient-to-br from-zinc-900 to-zinc-600`}
    >
      <NextIntlClientProvider
        timeZone={"America/New_York"}
        locale={"en"}
        messages={messages}
      >
        <div className="h-[calc(100%-220px)] md:h-[calc(100%-200px)]">
          <Header />
          <Signup
            showSignup={showSignInModal}
            onClose={() => setShowSignInModal(false)}
          />
          <AiChat showSignIn={setShowSignInModal} images={[]} />
        </div>
      </NextIntlClientProvider>
    </div>
  );
}
