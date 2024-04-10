import { TiZoom } from "react-icons/ti";
import { FaFileDownload } from "react-icons/fa";
import axios from "axios";
import fileDownload from "js-file-download";
import { useState } from "react";
import { PaymentType } from "../types";
import { useTranslations } from "next-intl";
import { Button } from "flowbite-react";
import { BACKEND_API_URL } from "@/src/common/lib/constant";

interface ChatDatasetProps {
  textMessage: string;
  avatarUrl?: string;
  dataset: any;
  onBeforeDownload: (data: any) => void;
  onDownload: (payment: PaymentType) => void;
  onBeforeAnalyze: (data: any) => void;
  onAnalyze: (ref: string) => void;
}

function ChatDataset({
  dataset,
  textMessage,
  avatarUrl,
  onBeforeDownload,
  onDownload,
  onBeforeAnalyze,
  onAnalyze,
}: ChatDatasetProps) {
  const t = useTranslations("ai");
  const [showMore, setShowMore] = useState(false);
  const showingDataset = showMore ? dataset : dataset.slice(0, 5);

  async function getDataset(data: any) {
    // Regular Chat API
    try {
      onBeforeDownload(data);
      const response = await axios.post(
        `${BACKEND_API_URL}v2/dataset/download`,
        {
          dataset: data.ref,
        }
      );
      const fileName = response?.data?.filename;
      onDownload(response?.data.payment);
      return fileName;
    } catch {}
    return false;
  }

  async function downloadDataset(filename: string) {
    // Regular Chat API
    try {
      const response = await axios.get(`${BACKEND_API_URL}${filename}`);
      fileDownload(response.data, filename);
    } catch (error) {
      console.log("error");
    }
    return false;
  }

  return (
    <div className={`flex justify-start mb-4`}>
      <img
        src={avatarUrl}
        className="object-cover h-12 w-12 rounded-full"
        alt=""
      />
      <div className="ml-2 py-3 px-4 bg-[#009182] rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white">
        <span>{textMessage}</span>

        <ul className="pt-4">
          {showingDataset.map((data: any, index: number) => {
            return (
              <li
                key={index}
                className="bg-white rounded-lg text-black mb-4 flex items-center"
              >
                {/* <img
                    className="object-cover rounded-tr-lg rounded-tl-lg w-full h-[100px]"
                    src={
                      'https://storage.googleapis.com/kaggle-datasets-images/4580651/7818480/97bc9a21bc6c5ac1d7e84a97e61e9730/dataset-thumbnail.jpg?t=2024-03-11-19-00-54'
                    }
                  /> */}
                <div className="py-2 px-4 px grow items-center">
                  <div className="grow">
                    <b>{data.title}</b>
                    <br />
                    <span>1 File CSV</span>
                  </div>
                </div>
                <div className="flex gap-1 mr-2">
                  <Button
                    color="light"
                    className="h-6 w-6 flex items-center"
                    onClick={async (e) => {
                      e.preventDefault();
                      await onBeforeAnalyze(data);
                      await onAnalyze(data.ref);
                    }}
                  >
                    <TiZoom className="h-4 w-4" />
                  </Button>
                  <Button
                    color="light"
                    className="h-6 w-6 flex items-center"
                    onClick={async (e) => {
                      e.preventDefault();
                      const filename = await getDataset(data);
                      const res = await downloadDataset(filename);
                    }}
                  >
                    <FaFileDownload />
                  </Button>
                </div>
              </li>
            );
          })}
          <div className="flex justify-center">
            {!showMore && (
              <Button
                color="light"
                onClick={() => {
                  setShowMore(true);
                }}
              >
                {t("aiPrompt.btnShowMore")}
              </Button>
            )}
          </div>
        </ul>
        <div></div>
      </div>
    </div>
  );
}

export default ChatDataset;
