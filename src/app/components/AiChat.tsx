"use client";

import DataSource from "./DataSource";
import ChatPanel from "./ChatPanel";
import {
  Dispatch,
  SetStateAction,
  use,
  useEffect,
  useRef,
  useState,
} from "react";
import { PaymentType } from "./types";
import ExamplePrompts from "./ExamplePrompts";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import { useProtocolLogsSelector } from "../reducers/aiBotSlice";
import ProtocolLogs from "./ProtocolLogs/ProtocolLogs";
import { setUser, useAuthSelector } from "../reducers/authentication";
import { HiLogout } from "react-icons/hi";
import { AppDispatch } from "@/src/store";
// import ProtocolLogsV2 from "./ProtocolLogs/ProtocolLogsV2";

type Image = any;
interface AiChatProps {
  images: Image[];
  showSignIn: Dispatch<SetStateAction<boolean>>;
}

export default function AiChat({ images, showSignIn }: AiChatProps) {
  const t = useTranslations("ai");
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector(useAuthSelector);
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
    <div className="0 h-full flex-grow">
      <div className="container mx-auto h-full rounded-lg shadow-lg">
        <div className="h-full justify-between rounded-lg bg-white sm:flex-col md:flex md:flex-row">
          <ChatPanel
            showSignIn={showSignIn}
            userImageUrl={
              userAvatarImageData?.url ||
              "https://avatars.githubusercontent.com/u/5210813?v=4"
            }
            robotImageUrl={
              botAvatarImageData?.url || "/images/aichat/ai-robot.png"
            }
          />
          <div className="hidden w-2/5 border-l-2 px-5 pt-5 md:block">
            <div className="flex h-full flex-col">
              {auth.user && (
                <div className="flex justify-between">
                  <div>
                    Welcome Back <b>{auth.user.username}</b>!
                  </div>
                  <Link
                    className="flex items-center"
                    href="void:0"
                    onClick={() => {
                      dispatch(setUser({}));
                    }}
                  >
                    <HiLogout />
                    <span className="ml-1 text-xs">Logout</span>
                  </Link>
                </div>
              )}
              {/* <img
                src={botImageData?.url || "/images/aichat/ai-robot-flat.png"}
                className="w-240px h-28 rounded-xl object-cover"
                alt=""
              /> */}
              <div>
                <p className="mt-6 font-bold">
                  {t("page.titleExamplePrompts")}
                </p>
                <ExamplePrompts />
              </div>
              <p className="mt-4 font-bold">
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
