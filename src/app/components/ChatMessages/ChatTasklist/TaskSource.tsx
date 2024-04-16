import { useMemo } from "react";

export default function TaskSource({ skillName }: { skillName: string }) {
  const imageUrl = useMemo(() => {
    if (skillName === "text_completion") {
      return "/images/aichat/logo-perplexity.svg";
    } else if (skillName === "random_joke") {
      return "/images/aichat/logo-humorapi.svg";
    } else if (skillName === "dataset_search") {
      return "/images/aichat/logo-kaggle.svg";
    } else if (skillName === "image_generation") {
      return "/images/aichat/logo-chatgpt.svg";
    } else if (skillName === "video_search" || skillName === "web_search") {
      return "/images/aichat/logo-gemini.svg";
    }
  }, [skillName]);

  if (!imageUrl) {
    return (
      <div className="mr-2 h-6 w-6 inline text-gray-700">
        <span className="h-6 w-6 text-[12px] inline-block bg-white rounded-sm text-center">
          {skillName && skillName[0]}
        </span>
      </div>
    );
  }

  return (
    <span className={`mr-4 h-6 w-6 flex-shrink-0`}>
      <img
        src={imageUrl}
        alt={skillName}
        className={`h-6 w-6 inline-block rounded-sm`}
      />
    </span>
  );
}
