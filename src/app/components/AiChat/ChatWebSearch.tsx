import Markdown from "react-markdown";
import { useTranslations } from "next-intl";

interface ChatWebSearchProps {
  direction: "left" | "right";
  avatarUrl?: string;
  textMessage?: string;
  results: [
    {
      title: string;
      snippet: string;
      link: string;
    }
  ];
}

function ChatWebSearch({
  direction,
  textMessage,
  avatarUrl,
  results,
}: ChatWebSearchProps) {
  const t = useTranslations("ai");

  const renderResults = () => {
    return results?.map((result, index) => (
      <div key={index}>
        <a href={result.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>
          <h3>{result.title}</h3>
        </a>
        <p style={{ fontStyle: 'italic' }}>{result.snippet}</p>
        <br />
      </div>
    ));
  };

  if (direction === "right") {
    return (
      <div className="flex justify-end mb-4">
        <div className="mr-2 py-3 px-4 bg-gray-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl">
          <article className="text-white prose">
            <Markdown>{textMessage}</Markdown>
          </article>
        </div>
        <img
          src={avatarUrl}
          className="object-cover h-12 w-12 rounded-full"
          alt=""
        />
      </div>
    );
  }

  return (
    <div className={`flex justify-start mb-4`}>
      <img
        src={avatarUrl}
        className="object-cover h-12 w-12 rounded-full"
        alt=""
      />
      <div className="ml-2 py-3 px-4 bg-[#009182] rounded-br-3xl rounded-tr-3xl rounded-tl-xl md:max-w-[400px] max-w-[calc(100%-80px)]">
        <article className="text-white prose">
          <Markdown>{textMessage}</Markdown>
        </article>
        {renderResults()}
      </div>
    </div>
  );
}

export default ChatWebSearch;
