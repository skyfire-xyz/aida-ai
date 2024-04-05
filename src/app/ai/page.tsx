"use client";

import { createKernelAccount } from "@zerodev/sdk";
import {
  createPasskeyValidator,
  getPasskeyValidator,
} from "@zerodev/passkey-validator";
import {
  signerToSessionKeyValidator,
  serializeSessionKeyAccount,
  oneAddress,
} from "@zerodev/session-key";
import React, { useEffect, useState } from "react";
import { createPublicClient, http } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import Image from "next/image";

import { Button, Card, Kbd } from "flowbite-react";
import Sidebar from "@/src/common/components/Sidebar";
import { AiOutlineLoading } from "react-icons/ai";
import { HiMiniArrowRightOnRectangle, HiMiniUserPlus } from "react-icons/hi2";
import { HiExternalLink, HiOutlinePlus } from "react-icons/hi";
import { BUNDLER_URL } from "@/src/common/lib/constant";
import Header from "./components/AiChat/Header";
import AiChat from "./components/AiChat/AiChat";
import { GetServerSideProps } from "next";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/src/locale/en.json";

export default async function Home() {
  return (
    <NextIntlClientProvider locale={"en"} messages={messages}>
      <div className="md:h-[calc(100%-200px)] h-[calc(100%-220px)]">
        <Header />
        <AiChat images={[]} />
      </div>
    </NextIntlClientProvider>
  );
}
