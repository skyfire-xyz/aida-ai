import Markdown from "react-markdown";
import { useTranslations } from "next-intl";
import { Accordion, Button, Card, List } from "flowbite-react";
import {
  MdOutlineCheckBox,
  MdOutlineCheckBoxOutlineBlank,
} from "react-icons/md";
import { ImSpinner11 } from "react-icons/im";
import { IoIosPlayCircle } from "react-icons/io";
import { MdOutlineArrowDropDown } from "react-icons/md";

import { executeTask, useTasklistSelector } from "../../reducers/aiBotSlice";
import { useDispatch, useSelector } from "react-redux";
import { AiBotSliceReduxState } from "../../reducers/types";
import { AppDispatch } from "@/src/store";
import { useState } from "react";
export interface ChatTaskListProps {
  avatarUrl?: string;
  textMessage?: string;
  results?: number[];
  // results: [
  //   {
  //     task: string;
  //     skill: string;
  //     status: string;
  //   }
  // ];
  onBeforeExecute: (taskName: string) => void;
  onExecute: (results: ChatTaskListProps) => void;
}

function ChatTaskList({
  textMessage,
  avatarUrl,
  results,
  onBeforeExecute = () => {},
  onExecute = () => {},
}: ChatTaskListProps) {
  const t = useTranslations("ai");
  const tasks = useSelector(useTasklistSelector);
  const [showTasks, setShowTasks] = useState<{ [key: number]: boolean }>({});
  const dispatch = useDispatch<AppDispatch>();

  const handleExecute = () => {
    onBeforeExecute(textMessage as string);
    // onExecute(results);
    results?.forEach((result) => {
      const task = tasks[result];
      dispatch(executeTask({ task }));
    });
  };

  return (
    <div className={`flex justify-start mb-4`}>
      <img
        src={avatarUrl}
        className="object-cover h-12 w-12 rounded-full"
        alt=""
      />
      <div className="ml-2 py-3 px-4 bg-[#009182] rounded-br-3xl rounded-tr-3xl rounded-tl-xl max-w-[calc(100%-80px)]">
        <article className="text-white prose">
          <Markdown>{textMessage}</Markdown>
        </article>
        {/* <List> */}
        {results?.map((result, index) => {
          const task = tasks[result];
          let StatusIcon = MdOutlineCheckBoxOutlineBlank;
          if (task.status === "complete") {
            StatusIcon = MdOutlineCheckBox;
          } else if (task.status === "pending") {
            StatusIcon = ImSpinner11;
          }

          return (
            <Card key={index} className="mb-4">
              <div className="flex items-center">
                <StatusIcon
                  className={`w-8 h-8 mr-4 ${
                    task.status === "pending" ? "animate-spin" : ""
                  }`}
                />
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  {task.task}
                </p>
                {task.status === "incomplete" && (
                  <IoIosPlayCircle
                    className="w-8 h-8 cursor-pointer"
                    onClick={() => dispatch(executeTask({ task }))}
                  />
                )}
                {task.status === "complete" && (
                  <MdOutlineArrowDropDown
                    className="w-8 h-8 cursor-pointer"
                    onClick={() => {
                      setShowTasks({
                        ...showTasks,
                        [task.id]: !showTasks[task.id],
                      });
                    }}
                  />
                )}
              </div>
              {showTasks[task.id] && <div>{task.result}</div>}
            </Card>
          );
        })}
        <Button className="mt-2" onClick={handleExecute}>
          Execute All Tasks
        </Button>
      </div>
    </div>
  );
}

export default ChatTaskList;
