import Markdown from "react-markdown";
import { useTranslations } from "next-intl";
import { Button, List } from "flowbite-react";
import {
  MdOutlineCheckBox,
  MdOutlineCheckBoxOutlineBlank,
} from "react-icons/md";
interface ChatTaskListProps {
  avatarUrl?: string;
  textMessage?: string;
  results: [
    {
      task: string;
      skill: string;
      status: string;
    }
  ];
  onBeforeExecute: (taskName: string) => void;
  onExecute: () => void;
}

function ChatTaskList({
  textMessage,
  avatarUrl,
  results,
  onBeforeExecute = () => {},
  onExecute = () => {},
}: ChatTaskListProps) {
  const t = useTranslations("ai");

  const handleExecute = () => {
    onBeforeExecute(textMessage as string);
    onExecute();
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
        <List>
          {results?.map((result, index) => (
            <List.Item
              key={index}
              icon={
                result.status === "complete"
                  ? MdOutlineCheckBox
                  : MdOutlineCheckBoxOutlineBlank
              }
              className="text-white"
            >
              {result.task}
            </List.Item>
          ))}
        </List>
        <Button className="mt-2" onClick={handleExecute}>
          Execute All Tasks
        </Button>
      </div>
    </div>
  );
}

export default ChatTaskList;
