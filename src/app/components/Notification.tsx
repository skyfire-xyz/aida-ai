import { Alert, Toast } from "flowbite-react";
import { HiExclamation } from "react-icons/hi";
import { HiCheck } from "react-icons/hi2";
import { MdLoop } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AppDispatch } from "@/src/store";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationProps {
  asyncActionKey: string;
  messages: {
    success: string;
    error: string;
    pending: string;
  };
  selector: (state: any) => {
    status: { [key: string]: "idle" | "pending" | "succeeded" | "failed" };
  };
  resetStatus: (payload: { key: string; status: string }) => any;
}

export default function Notification({
  asyncActionKey,
  resetStatus,
  messages,
  selector,
}: NotificationProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector(selector);

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
      setOpenInfo("");
      setOpenError(messages.error);

      // Reset
      setTimeout(() => {
        dispatch(resetStatus({ key: asyncActionKey, status: "idle" }));
      }, 3000);
    } else if (status[asyncActionKey] === "idle") {
      setOpenInfo("");
      setOpenSuccess("");
      setOpenError("");
    }
  }, [status]);

  return (
    <AnimatePresence initial={false} mode="wait">
      {!!openInfo && (
        <motion.div
          key={asyncActionKey}
          initial={{
            position: "fixed",
            opacity: 0,
            top: 30,
            right: 0,
            x: 500,
            zIndex: 50,
          }}
          animate={{ opacity: 1, top: 30, x: 0, right: 0, width: "100%" }}
          exit={{
            opacity: 0,
            top: 30,
            x: 0,
            right: 0,
            transition: { duration: 0.5 },
          }}
        >
          <Toast className="fixed right-[30px] z-50 max-w-sm dark:bg-cyan-200 dark:text-cyan-800">
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-500 dark:bg-cyan-900 dark:text-cyan-300">
              <MdLoop className="h-5 w-5 animate-spin" />
            </div>
            <div className="pl-4 text-sm font-normal">
              <div dangerouslySetInnerHTML={{ __html: openInfo }} />
            </div>
            <Toast.Toggle
              className="dark:bg-cyan-200 dark:text-cyan-800 dark:hover:bg-cyan-200 dark:hover:text-cyan-800"
              onClick={() => setOpenInfo("")}
            />
          </Toast>
        </motion.div>
      )}
      {!!openSuccess && (
        <motion.div
          key={asyncActionKey}
          initial={{
            position: "fixed",
            opacity: 0,
            top: 30,
            right: 0,
            x: 500,
            zIndex: 50,
          }}
          animate={{ opacity: 1, top: 30, x: 0, right: 0, width: "100%" }}
          exit={{
            opacity: 0,
            top: 30,
            x: 0,
            right: 0,
            transition: { duration: 0.5 },
          }}
        >
          <Toast className="fixed right-[30px] z-50 max-w-sm dark:bg-green-200 dark:text-green-800">
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
              <HiCheck className="h-5 w-5" />
            </div>
            <div className="pl-4 text-sm font-normal">
              <div dangerouslySetInnerHTML={{ __html: openSuccess }} />
            </div>
            <Toast.Toggle
              className="dark:bg-green-200 dark:text-green-800 dark:hover:bg-green-200 dark:hover:text-green-800"
              onClick={() => setOpenSuccess("")}
            />
          </Toast>
        </motion.div>
      )}
      {!!openError && (
        <motion.div
          key={asyncActionKey}
          initial={{
            position: "fixed",
            opacity: 0,
            top: 30,
            right: 0,
            x: 500,
            zIndex: 50,
          }}
          animate={{ opacity: 1, top: 30, x: 0, right: 0, width: "100%" }}
          exit={{
            opacity: 0,
            top: 30,
            x: 0,
            right: 0,
            transition: { duration: 0.5 },
          }}
        >
          <Toast className="fixed right-[30px] z-50 max-w-sm dark:bg-red-200 dark:text-red-800">
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
              <HiExclamation className="h-5 w-5" />
            </div>
            <div className="pl-4 text-sm font-normal">
              <div dangerouslySetInnerHTML={{ __html: openError }} />
            </div>
            <Toast.Toggle
              className="dark:bg-red-200 dark:text-red-800 dark:hover:bg-red-200 dark:hover:text-red-800"
              onClick={() => setOpenError("")}
            />
          </Toast>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
