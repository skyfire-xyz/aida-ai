import Markdown from "react-markdown";
import { useTranslations } from "next-intl";
import { Card } from "flowbite-react";
import BodyVideos from "./BodyVideos";

export interface ChatVideoSearchProps {
  direction: "left" | "right";
  avatarUrl?: string;
  textMessage?: string;
  results: [
    {
      title: string;
      link: string;
      description: string;
      thumbnail: {
        static: string;
        rich: string;
      };
    }
  ];
}

function ChatVideoSearch({
  direction,
  textMessage,
  avatarUrl,
  results,
}: ChatVideoSearchProps) {
  const t = useTranslations("ai");

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
        <BodyVideos results={results} />
      </div>
    </div>
  );
}

export default ChatVideoSearch;
