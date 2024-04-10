import Markdown from "react-markdown";
import { useTranslations } from "next-intl";
import { Card } from "flowbite-react";

interface ChatVideoSearchProps {
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

  const renderResults = () => {
    return results?.map((result, index) => (
      <Card
        key={index}
        className="max-w-lg mb-2 cursor-pointer"
        imgSrc={result.thumbnail.static}
        onClick={() =>
          window.open(result.link, "_blank", "noopener,noreferrer")
        }
        horizontal
      >
        <h5 className="font-bold tracking-tight text-gray-900 dark:text-white">
          {result.title}
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          {result.description}
        </p>
      </Card>
    ));
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
        {renderResults()}
      </div>
    </div>
  );
}

export default ChatVideoSearch;
