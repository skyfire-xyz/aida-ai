import { Toast } from "flowbite-react";
import { HiExclamation } from "react-icons/hi";
import { HiCheck } from "react-icons/hi2";
import { MdLoop } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { resetStatus, useDashboardSelector } from "../reducers/dashboardSlice";
import { useEffect, useState } from "react";
import { AppDispatch } from "@/src/store";

interface NotificationProps {
  asyncActionKey: string;
  messages: {
    success: string;
    error: string;
    pending: string;
  };
}

export default function Notification({
  asyncActionKey,
  messages,
}: NotificationProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector(useDashboardSelector);

  const [openError, setOpenError] = useState("");
  const [openSuccess, setOpenSuccess] = useState("");
  const [openInfo, setOpenInfo] = useState("");

  useEffect(() => {
    if (status[asyncActionKey] === "succeeded") {
      setOpenInfo("");
      setOpenSuccess(messages.success);

      // Reset
      setTimeout(() => {
        dispatch(resetStatus({ key: asyncActionKey, status: "idle" }));
      }, 3000);
    } else if (status[asyncActionKey] === "pending") {
      setOpenInfo(messages.pending);
    } else if (status[asyncActionKey] === "failed") {
      setOpenError(messages.error);

      // Reset
      setTimeout(() => {
        dispatch(resetStatus({ key: "createWallet", status: "idle" }));
      }, 3000);
    } else if (status[asyncActionKey] === "idle") {
      setOpenInfo("");
      setOpenSuccess("");
      setOpenError("");
    }
  }, [status]);

  return (
    <>
      {!!openInfo && (
        <Toast className="fixed bottom-10 left-10 z-50 max-w-sm">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-500 dark:bg-cyan-900 dark:text-cyan-300">
            <MdLoop className="h-5 w-5 animate-spin" />
          </div>
          <div className="pl-4 text-sm font-normal">
            <div dangerouslySetInnerHTML={{ __html: openInfo }} />
          </div>
          <Toast.Toggle onClick={() => setOpenInfo("")} />
        </Toast>
      )}
      {!!openSuccess && (
        <Toast className="fixed bottom-10 left-10 z-50 max-w-sm">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <HiCheck className="h-5 w-5" />
          </div>
          <div className="pl-4 text-sm font-normal">
            <div dangerouslySetInnerHTML={{ __html: openSuccess }} />
          </div>
          <Toast.Toggle onClick={() => setOpenSuccess("")} />
        </Toast>
      )}
      {!!openError && (
        <Toast className="fixed bottom-10 left-10 z-50 max-w-sm">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
            <HiExclamation className="h-5 w-5" />
          </div>
          <div className="pl-4 text-sm font-normal">
            <div dangerouslySetInnerHTML={{ __html: openError }} />
          </div>
          <Toast.Toggle onClick={() => setOpenError("")} />
        </Toast>
      )}
    </>
  );
}
