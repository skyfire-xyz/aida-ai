"use client";

import DataSource from "./DataSource";
import ChatPanel from "./ChatPanel";
import { useEffect, useRef, useState } from "react";
import { PaymentType } from "./types";
import ExamplePrompts from "./ExamplePrompts";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { useProtocolLogsSelector } from "../reducers/aiBotSlice";
import ProtocolLogs from "./ProtocolLogs/ProtocolLogs";
// import ProtocolLogsV2 from "./ProtocolLogs/ProtocolLogsV2";

type Image = any;
interface AiChatProps {
  images: Image[];
}

export default function AiChat({ images }: AiChatProps) {
  const t = useTranslations("ai");
  const [mounted, setMounted] = useState(false);
  // const userAvatarImageData = getStrapiDataAttributes(
  //   images?.find((data) => data.attributes.name === "userAvatar")
  // );
  // const botAvatarImageData = getStrapiDataAttributes(
  //   images?.find((data) => data.attributes.name === "botAvatar")
  // );
  // const botImageData = getStrapiDataAttributes(
  //   images?.find((data) => data.attributes.name === "botImageWide")
  // );

  useEffect(() => {
    setMounted(true);
  }, []);
  const userAvatarImageData = { url: "" };
  const botAvatarImageData = { url: "" };
  const botImageData = { url: "" };

  return (
    <div className="0 flex-grow h-full">
      <div className="container mx-auto shadow-lg rounded-lg h-full">
        <div className="md:flex md:flex-row sm:flex-col justify-between bg-white h-full rounded-lg">
          <ChatPanel
            userImageUrl={
              userAvatarImageData?.url ||
              "https://avatars.githubusercontent.com/u/5210813?v=4"
            }
            robotImageUrl={
              botAvatarImageData?.url || "/images/aichat/ai-robot.png"
            }
          />
          <div className="w-2/5 border-l-2 px-5 pt-5 md:block hidden">
            <div className="flex flex-col h-full">
              <img
                src={botImageData?.url || "/images/aichat/ai-robot-flat.png"}
                className="object-cover rounded-xl h-28 w-240px"
                alt=""
              />
              <div>
                <p className="font-bold mt-6">
                  {t("page.titleExamplePrompts")}
                </p>
                <ExamplePrompts />
              </div>
              <p className="font-bold mt-4">
                <Link
                  href="https://www.oklink.com/amoy/address/0x45c83889BD84D5FB77039B67C30695878f506313/token-transfer"
                  target="_blank"
                >
                  <b>{t("page.titlePaymentLogs")}</b>
                </Link>
              </p>
              {/* <ProtocolLogsV2 /> */}
              <ProtocolLogs />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
