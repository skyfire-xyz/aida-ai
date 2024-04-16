import { Card } from "flowbite-react";
import { ChatVideoSearchProps } from "./ChatVideoSearch";

export default function BodyVideos({
  results,
}: {
  results: ChatVideoSearchProps["results"];
}) {
  return results?.map((result, index) => (
    <Card
      key={index}
      className="max-w-lg mb-2 cursor-pointer"
      imgSrc={result.thumbnail.static}
      onClick={() => window.open(result.link, "_blank", "noopener,noreferrer")}
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
}
