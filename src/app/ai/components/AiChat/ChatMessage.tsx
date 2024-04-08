// import DownloadIcon from '@mui/icons-material/Download';
import Markdown from "react-markdown";
import ShareOnSocials from "./ShareOnSocials";
// import { Button } from '@mui/material';
import fileDownload from "js-file-download";
import { Button } from "flowbite-react";
import { useTranslations } from "next-intl";

interface ChatMessageProps {
  direction: "left" | "right";
  avatarUrl?: string;
  textMessage?: string;
  contentImageUrl?: string;
  children?: React.ReactNode;
}

function ChatMessage({
  direction,
  textMessage,
  avatarUrl,
  contentImageUrl,
  children,
}: ChatMessageProps) {
  const t = useTranslations("ai");
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
        {children && <div className="mt-2">{children}</div>}
        {contentImageUrl && (
          <div>
            <img
              src={contentImageUrl}
              className="mt-4 object-cover w-90 h-90 rounded-xl"
            />
            <div className="mt-2 flex mx-auto gap-2 justify-center">
              <Button
                color="light"
                onClick={() => {
                  fileDownload(contentImageUrl, textMessage + ".png");
                }}
              >
                {t("aiPrompt.btnDownloadImage")}
              </Button>
              {/* <ShareOnSocials /> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
