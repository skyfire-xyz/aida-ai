"use client";

import { useEffect, useState } from "react";
import { SKYFIRE_API_KEY } from "../config/envs";
import Header from "../components/header";
import APIKeyModal from "../components/api-key-modal";
import AiChat from "../components/ai-chat";

export default function Home() {
  const [showSignInModal, setShowSignInModal] = useState(true);

  useEffect(() => {
    setShowSignInModal(!SKYFIRE_API_KEY);
  }, []);

  return (
    <div
      className={`font-jones h-screen bg-gradient-to-br from-zinc-900 to-zinc-600`}
    >
      <div className="h-[calc(100%-220px)] md:h-[calc(100%-200px)]">
        <Header />
        <APIKeyModal
          showSignup={showSignInModal}
          onClose={() => setShowSignInModal(false)}
        />
        <AiChat showSignIn={setShowSignInModal} images={[]} />
      </div>
    </div>
  );
}
