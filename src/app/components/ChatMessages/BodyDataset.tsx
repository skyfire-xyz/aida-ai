import axios from "axios";
import fileDownload from "js-file-download";

import { Button, Card } from "flowbite-react";
import { ChatVideoSearchProps } from "./ChatVideoSearch";
import { MouseEvent, MouseEventHandler, use, useState } from "react";
import { FaFileDownload } from "react-icons/fa";
import { TiZoom } from "react-icons/ti";
import { useTranslations } from "next-intl";
import { ChatDatasetProps } from "./ChatDataset";
import { BACKEND_API_URL } from "@/src/common/lib/constant";
import { addProtocolLog, fetchAnalyzeDataset } from "../../reducers/aiBotSlice";
import { useDispatch } from "react-redux";
import App from "next/app";
import { AppDispatch } from "@/src/store";

export default function BodyDataset({ datasets }: ChatDatasetProps) {
  const t = useTranslations("ai");
  const dispatch = useDispatch<AppDispatch>();
  const [showMore, setShowMore] = useState(false);
  const showingDatasets = showMore ? datasets : datasets.slice(0, 5);

  async function getDataset(data: any) {
    // Regular Chat API
    try {
      const response = await axios.post(
        `${BACKEND_API_URL}v2/dataset/download`,
        {
          dataset: data.ref,
        }
      );
      const fileName = response?.data?.filename;
      dispatch(
        addProtocolLog({ payload: { payment: response?.data.payment } })
      );
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
    <ul className="pt-4">
      {showingDatasets.map((data: any, index: number) => {
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
                onClick={async (e: MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  dispatch(fetchAnalyzeDataset({ ref: data.ref }));
                }}
              >
                <TiZoom className="h-4 w-4" />
              </Button>
              <Button
                color="light"
                className="h-6 w-6 flex items-center"
                onClick={async (e: MouseEvent<HTMLButtonElement>) => {
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
        {!showMore && datasets.length > 5 && (
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
  );
}
