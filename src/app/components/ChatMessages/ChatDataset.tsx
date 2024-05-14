import { TiZoom } from "react-icons/ti";
import { FaFileDownload } from "react-icons/fa";
import axios from "axios";
import fileDownload from "js-file-download";
import { useState } from "react";
import { PaymentType } from "../types";
import { useTranslations } from "next-intl";
import { Button } from "flowbite-react";
import { BACKEND_API_URL } from "@/src/common/lib/constant";
import BodyDataset from "./BodyDataset";

export interface ChatDatasetProps {
  textMessage: string;
  avatarUrl?: string;
  datasets: any;
}

function ChatDataset(props: ChatDatasetProps) {
  return (
    <div className={`mb-4 flex justify-start`}>
      <img
        src={props.avatarUrl}
        className="h-10 w-10 rounded-full object-cover"
        alt=""
      />
      <div className="ml-2 rounded-br-3xl rounded-tl-xl rounded-tr-3xl bg-[#009182] px-4 py-3 text-white">
        <span>{props.textMessage}</span>
        <BodyDataset {...props} />
      </div>
    </div>
  );
}

export default ChatDataset;
