import { useMemo } from "react";

export default function SourceLogo({ sourceName }: { sourceName: string }) {
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
      <div className="mr-2 h-4 w-4 inline text-gray-700">
        <span className="h-4 w-4 text-[12px] inline-block bg-white rounded-sm text-center">
          {sourceName[0]}
        </span>
      </div>
    );
  }

  return (
    <span className="mr-2 h-4 w-4">
      <img
        src={imageUrl}
        alt={sourceName}
        className={`h-4 w-4 inline-block rounded-sm ${
          sourceName === "Perplexity" ? "bg-white" : ""
        }`}
      />
    </span>
  );
}
