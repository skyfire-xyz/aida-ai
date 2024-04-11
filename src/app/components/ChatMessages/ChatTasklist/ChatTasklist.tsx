import { useState } from "react";
import Markdown from "react-markdown";
import { useTranslations } from "next-intl";
import { Accordion, Button, Card, List } from "flowbite-react";
import {
  MdOutlineCheckBox,
  MdOutlineCheckBoxOutlineBlank,
} from "react-icons/md";
import { ImSpinner11 } from "react-icons/im";
import { FaPlay } from "react-icons/fa";
import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md";
import TaskSource from "./TaskSource";

import { executeTask, useTasklistSelector } from "../../../reducers/aiBotSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/src/store";

import BodyVideos from "../BodyVideos";
import BodySearch from "../BodySearch";
import TaskContent from "./TaskContent";

export interface ChatTaskListProps {
  avatarUrl?: string;
  textMessage?: string;
  results?: string[];
}

function ChatTaskList({ textMessage, avatarUrl, results }: ChatTaskListProps) {
  const t = useTranslations("ai");
  const tasks = useSelector(useTasklistSelector);
  const [showTasks, setShowTasks] = useState<{ [key: number]: boolean }>({});
  const dispatch = useDispatch<AppDispatch>();

  const handleExecute = () => {
    results?.forEach((result) => {
      const task = tasks[result];
      if (task.status === "complete") return;
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
            <Card
              key={index}
              // onClick={() => {
              //   if (task.status === "complete") {
              //     setShowTasks({
              //       ...showTasks,
              //       [task.id]: !showTasks[task.id],
              //     });
              //   }
              // }}
              className={`mb-4 ${
                task.status === "complete"
                  ? "bg-green-100 cursor-pointer"
                  : "white"
              }`}
            >
              <div className="flex items-center">
                <TaskSource skillName={task.skill} />
                {/* <StatusIcon
                  color=""
                  className={`w-8 h-8 mr-4 ${
                    task.status === "pending" ? "animate-spin" : ""
                  } 
                  flex-shrink-0`}
                /> */}
                <p
                  className="font-normal text-gray-700 dark:text-gray-400 flex-grow-1"
                  onClick={() => {
                    if (task.status === "complete") {
                      setShowTasks({
                        ...showTasks,
                        [task.id]: !showTasks[task.id],
                      });
                    }
                  }}
                >
                  {task.task}
                </p>
                <div className="flex ml-auto items-center">
                  {task.status === "incomplete" && (
                    <Button
                      color="light"
                      className="ml-4"
                      onClick={() => dispatch(executeTask({ task }))}
                    >
                      <div className="flex items-center">
                        <FaPlay
                          color="#009182"
                          className="w-4 h-4 cursor-pointer flex-shrink-0"
                        />
                      </div>
                    </Button>
                  )}
                  {task.status === "pending" && (
                    <Button
                      color="light"
                      className="ml-4"
                      disabled
                      onClick={() => dispatch(executeTask({ task }))}
                    >
                      <div className="flex items-center animate-spin">
                        <ImSpinner11
                          color="#009182"
                          className="w-4 h-4 cursor-pointer flex-shrink-0"
                        />
                      </div>
                    </Button>
                  )}
                  {task.status === "complete" &&
                    (showTasks[task.id] ? (
                      <MdOutlineArrowDropUp
                        className="w-8 h-8 cursor-pointer flex-shrink-0"
                        onClick={() => {
                          setShowTasks({
                            ...showTasks,
                            [task.id]: !showTasks[task.id],
                          });
                        }}
                      />
                    ) : (
                      <MdOutlineArrowDropDown
                        className="w-8 h-8 cursor-pointer flex-shrink-0"
                        onClick={() => {
                          setShowTasks({
                            ...showTasks,
                            [task.id]: !showTasks[task.id],
                          });
                        }}
                      />
                    ))}
                </div>
              </div>
              {showTasks[task.id] && <TaskContent task={task} />}
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
