import { useMemo } from "react";

export default function ServiceIcons({ sourceName }: { sourceName: string }) {
  const imageUrl = useMemo(() => {
    if (sourceName === "Perplexity") {
      return "/images/aichat/logo-perplexity.svg";
    } else if (sourceName === "HumorAI") {
      return "/images/aichat/logo-humorapi.svg";
    } else if (sourceName === "KaggleAI") {
      return "/images/aichat/logo-kaggle.svg";
    } else if (sourceName === "ChatGPT") {
      return "/images/aichat/logo-chatgpt.svg";
    } else if (sourceName === "Gemini") {
      return "/images/aichat/logo-gemini.svg";
    }
  }, [sourceName]);

  if (!imageUrl) {
    return (
      <div className="mr-2 inline h-4 w-4 text-gray-700">
        <span className="inline-block h-4 w-4 rounded-sm bg-white text-center text-[12px]">
          {sourceName && sourceName[0]}
        </span>
      </div>
    );
  }

  return (
    <span className={`mr-2 h-4 w-4 flex-shrink-0`}>
      <img
        src={imageUrl}
        alt={sourceName}
        className={`inline-block h-4 w-4 rounded-sm ${
          sourceName === "Perplexity" ? "bg-white" : ""
        }`}
      />
    </span>
  );
}
