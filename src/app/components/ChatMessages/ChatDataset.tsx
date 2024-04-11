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
    <div className={`flex justify-start mb-4`}>
      <img
        src={props.avatarUrl}
        className="object-cover h-12 w-12 rounded-full"
        alt=""
      />
      <div className="ml-2 py-3 px-4 bg-[#009182] rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white">
        <span>{props.textMessage}</span>
        <BodyDataset {...props} />
      </div>
    </div>
  );
}

export default ChatDataset;
