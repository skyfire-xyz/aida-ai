import fileDownload from "js-file-download";

import { Button } from "flowbite-react";
import { MouseEvent, useState } from "react";
import { FaFileDownload } from "react-icons/fa";
import { TiZoom } from "react-icons/ti";
import { useTranslations } from "next-intl";
import { ChatDatasetProps } from "./ChatDataset";
import { addProtocolLog, fetchAnalyzeDataset } from "../../reducers/aiBotSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/store";
import api from "@/src/lib/api";

export default function BodyDataset({ datasets }: ChatDatasetProps) {
  const t = useTranslations("ai");
  const dispatch = useDispatch<AppDispatch>();
  const [showMore, setShowMore] = useState(false);
  const showingDatasets = showMore ? datasets : datasets.slice(0, 5);

  async function getDataset(data: any) {
    // Regular Chat API
    try {
      const response = await api.post(`v1/receivers/kaggle/download`, {
        dataset: data.ref,
      });
      const fileName = response?.data?.filename;
      dispatch(
        addProtocolLog({ payload: { payment: response?.data.payment } }),
      );
      return fileName;
    } catch {}
    return false;
  }

  async function downloadDataset(filename: string) {
    // Regular Chat API
    try {
      const response = await api.get(`${filename}`);
      fileDownload(response.data, filename);
    } catch (error) {
      console.log("error");
    }
    return false;
  }

  return (
    <ul className="pt-2">
      {showingDatasets.map((data: any, index: number) => {
        return (
          <li
            key={index}
            className="mb-4 flex items-center rounded-lg bg-white text-black"
          >
            <div className="px grow items-center px-4 py-2">
              <div className="grow">
                <b>{data.title}</b>
                <br />
                <span>1 File CSV</span>
              </div>
            </div>
            <div className="mr-2 flex gap-1">
              <Button
                color="light"
                className="flex h-6 w-6 items-center"
                onClick={async (e: MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  dispatch(fetchAnalyzeDataset({ ref: data.ref }));
                }}
              >
                <TiZoom className="h-4 w-4" />
              </Button>
              <Button
                color="light"
                className="flex h-6 w-6 items-center"
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
