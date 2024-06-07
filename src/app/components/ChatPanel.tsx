import { useDispatch, useSelector } from "react-redux";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import { IoIosInformationCircleOutline } from "react-icons/io";

import ChatGeneral from "./ChatMessages/ChatGeneral";
import ChatDataset from "./ChatMessages/ChatDataset";
import { useEffect, useRef, useState } from "react";
import BouncingDotsLoader from "./BouncingLoader";
import { getLogoAIData, scrollToBottom } from "../utils";
import { ChatMessageType } from "./types";
import ExamplePrompts from "./ExamplePrompts";
import { Button, Modal, TextInput } from "flowbite-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import ChatTaskList from "./ChatMessages/ChatTasklist/ChatTasklist";
import ChatWebSearch from "./ChatMessages/ChatWebSearch";
import ChatVideoSearch from "./ChatMessages/ChatVideoSearch";
import {
  addInitialMessage,
  addMessage,
  fetchLogoAgent,
  postChat,
  setBotStatus,
  setShouldScrollToBottom,
  useAiBotSelector,
} from "../reducers/aiBotSlice";
import { AppDispatch } from "@/src/store";
import ProtocolLogs from "./ProtocolLogs/ProtocolLogs";
import { SKYFIRE_API_KEY } from "@/src/lib/constant";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function ChatPane(props: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, status, shouldScrollToBottom } =
    useSelector(useAiBotSelector);

  const t = useTranslations("ai");
  const [inputText, setInputText] = useState("");
  const [showExamples, setShowExamples] = useState(false);
  const [showMicroPayments, setShowMicroPayments] = useState(false);

  const chatMessages = useRef<ChatMessageType[]>([]);
  const chatPaneRef = useRef<HTMLDivElement>(null);

  const { robotImageUrl, userImageUrl } = props;

  // Common Utilities
  const addBotResponseMessage = (
    prompt: string,
    data?: any,
    type?: ChatMessageType["type"],
  ) => {
    chatMessages.current = [
      ...chatMessages.current,
      {
        type: type || "chat",
        direction: "left",
        avatarUrl: robotImageUrl,
        textMessage: prompt,
        data,
      },
    ];
  };

  useEffect(() => {
    scrollToBottom([chatPaneRef], () => {
      dispatch(setShouldScrollToBottom(false));
    });
  }, [shouldScrollToBottom]);

  useEffect(() => {
    dispatch(
      addInitialMessage({
        textMessage: t("aiPrompt.defaultGreeting"),
      }),
    );
  }, [messages]);

  // Process User Input
  const handleEnter = async (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === "Enter") {
      dispatch(
        addMessage({
          type: "chat",
          direction: "right",
          avatarUrl: userImageUrl,
          textMessage: inputText,
        }),
      );

      setTimeout(() => {
        chatPaneRef.current?.scrollTo({ top: 99999, behavior: "smooth" });
      }, 100);

      setInputText("");

      // Wait for a little bit to simulate bot thinking
      await sleep(300);

      // API Call here
      if (inputText.toLocaleLowerCase().includes("search dataset")) {
        ///////////////////////////////////////////////////////////
        // Dataset Request
        ///////////////////////////////////////////////////////////
        let searchTerm = "";

        const match = inputText.match(/search dataset:(.+)/i);
        if (match) {
          searchTerm = match[1];
        }

        if (!searchTerm) {
          dispatch(
            addMessage({
              type: "chat",
              textMessage: t("aiPrompt.errorMessage"),
            }),
          );
          return;
        }
        dispatch(
          postChat({
            chatType: "dataset_search",
            data: { prompt: searchTerm.trim() },
          }),
        );
      } else if (inputText.toLocaleLowerCase().includes("tasklist")) {
        ///////////////////////////////////////////////////////////
        // Tasklist
        ///////////////////////////////////////////////////////////
        let searchTerm = "";

        const match = inputText.match(/tasklist:(.+)/i);
        if (match) {
          searchTerm = match[1];
        }

        if (!searchTerm) {
          addBotResponseMessage(t("aiPrompt.errorMessage"));
          return;
        }

        dispatch(
          postChat({
            chatType: "tasklist",
            data: { prompt: searchTerm.trim() },
          }),
        );
      } else if (inputText.toLocaleLowerCase().includes("websearch")) {
        ///////////////////////////////////////////////////////////
        // Web Search Request
        ///////////////////////////////////////////////////////////
        let searchTerm = "";

        const match = inputText.match(/websearch:(.+)/i);
        if (match) {
          searchTerm = match[1];
        }

        if (!searchTerm) {
          addBotResponseMessage(t("aiPrompt.errorMessage"));
          return;
        }

        dispatch(
          postChat({
            chatType: "web_search",
            data: { prompt: searchTerm.trim() },
          }),
        );
      } else if (inputText.toLocaleLowerCase().includes("videosearch")) {
        ///////////////////////////////////////////////////////////
        // Video Search Request
        ///////////////////////////////////////////////////////////
        let searchTerm = "";

        const match = inputText.match(/videosearch:(.+)/i);
        if (match) {
          searchTerm = match[1];
        }

        if (!searchTerm) {
          addBotResponseMessage(t("aiPrompt.errorMessage"));
          return;
        }
        dispatch(
          postChat({
            chatType: "video_search",
            data: { prompt: searchTerm.trim() },
          }),
        );
      } else if (
        inputText.toLocaleLowerCase().includes("generate gif") ||
        inputText.toLocaleLowerCase().includes("generate meme") ||
        inputText.toLocaleLowerCase().includes("generate image")
      ) {
        ///////////////////////////////////////////////////////////
        // Generate Image Request
        ///////////////////////////////////////////////////////////
        let searchTerm = "";

        let match = inputText.match(/generate image:(.+)/i);
        if (!match) match = inputText.match(/generate gif:(.+)/i);
        if (!match) match = inputText.match(/generate meme:(.+)/i);

        if (match) {
          searchTerm = match[1];
        }

        if (!searchTerm) {
          addBotResponseMessage(t("aiPrompt.errorMessage"));
          return;
        }

        // Generate Image API
        dispatch(
          postChat({
            chatType: "image_generation",
            data: { prompt: searchTerm.trim() },
          }),
        );
      } else if (
        inputText.toLocaleLowerCase().includes("random gif") ||
        inputText.toLocaleLowerCase().includes("random meme") ||
        inputText.toLocaleLowerCase().includes("random image")
      ) {
        ///////////////////////////////////////////////////////////
        // Meme Request
        ///////////////////////////////////////////////////////////
        let searchTerm = "";

        let match = inputText.match(/random image:(.+)/i);
        if (!match) match = inputText.match(/random gif:(.+)/i);
        if (!match) match = inputText.match(/random meme:(.+)/i);

        if (match) {
          searchTerm = match[1];
        }

        if (!searchTerm) {
          addBotResponseMessage(t("aiPrompt.errorMessage"));
          return;
        }

        dispatch(
          postChat({
            chatType: "meme",
            data: { searchTerm: searchTerm.trim(), meme: true },
          }),
        );
      } else if (inputText.includes("joke")) {
        ///////////////////////////////////////////////////////////
        // Joke Request
        ///////////////////////////////////////////////////////////

        dispatch(
          postChat({
            chatType: "random_joke",
            data: { searchTerm: "", meme: false },
          }),
        );
      } else {
        ///////////////////////////////////////////////////////////
        // Regular Chat Request
        ///////////////////////////////////////////////////////////

        if (
          inputText.toLocaleLowerCase().includes("logo") &&
          inputText.toLocaleLowerCase().includes("now")
        ) {
          // Logo request after creating a wallet on admin console
          const logoAIAgent = getLogoAIData();
          dispatch(fetchLogoAgent({ logoAIAgent }));
        } else {
          // Logo request before creating a wallet
          // dispatch(fetchChat({ prompt: inputText }));
          dispatch(
            postChat({
              chatType: "chat",
              data: {
                prompt: inputText,
              },
            }),
          );

          if (inputText.toLocaleLowerCase().includes("logo")) {
            dispatch(setBotStatus(true));
            setTimeout(() => {
              dispatch(setBotStatus(false));
              dispatch(
                addMessage({
                  type: "chat",
                  textMessage: t("aiPrompt.textVisitAdminDashboard"),
                }),
              );
            }, 1000);
          }
        }
      }

      if (ev.preventDefault) ev.preventDefault();
    }
  };

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div
        id="chat-pane"
        className="mt-5 flex flex-grow flex-col overflow-scroll px-5 "
        ref={chatPaneRef}
      >
        {messages &&
          messages.map((message: ChatMessageType, index: number) => {
            if (message.type === "dataset_search") {
              return (
                <ChatDataset
                  avatarUrl={message.avatarUrl}
                  key={index}
                  textMessage=""
                  datasets={message.data}
                />
              );
            } else if (message.type === "tasklist") {
              return (
                <ChatTaskList
                  avatarUrl={message.avatarUrl}
                  key={index}
                  textMessage=""
                  results={message.data}
                />
              );
            } else if (message.type === "web_search") {
              return (
                <ChatWebSearch
                  key={index}
                  direction={message.direction}
                  avatarUrl={message.avatarUrl}
                  textMessage={message.textMessage}
                  results={message.data}
                />
              );
            } else if (message.type === "video_search") {
              return (
                <ChatVideoSearch
                  key={index}
                  direction={message.direction}
                  avatarUrl={message.avatarUrl}
                  textMessage={message.textMessage}
                  results={message.data}
                />
              );
            }
            return (
              <ChatGeneral
                key={index}
                direction={message.direction}
                avatarUrl={message.avatarUrl}
                textMessage={message.textMessage}
                contentImageUrl={message.data}
              />
            );
          })}

        {status.botThinking && (
          <ChatGeneral direction="left" avatarUrl={robotImageUrl}>
            <BouncingDotsLoader />
          </ChatGeneral>
        )}
      </div>
      <div className="flex-none px-3 py-5 pt-1 md:pt-5">
        <div className="mb-2 flex justify-end md:hidden">
          <HiOutlineCurrencyDollar
            className="h-5 w-5"
            onClick={() => setShowMicroPayments(true)}
          />
          <IoIosInformationCircleOutline
            className="h-5 w-5"
            onClick={() => setShowExamples(true)}
          />
        </div>
        {!SKYFIRE_API_KEY ? (
          <Button
            className="w-full rounded-xl"
            onClick={() => {
              props.showSignIn(true);
            }}
          >
            {t("page.chatSignIn")}
          </Button>
        ) : (
          <TextInput
            className="w-full rounded-xl bg-[#f7f9fa]"
            placeholder={t("page.chatPlaceholder")}
            value={inputText}
            onChange={(ev) => {
              setInputText(ev?.target?.value);
            }}
            onKeyDown={handleEnter}
          ></TextInput>
        )}
      </div>
      <Modal
        show={showMicroPayments}
        onClose={() => setShowMicroPayments(false)}
      >
        <Modal.Header>
          <Link href="https://www.oklink.com/amoy/address/0x45c83889BD84D5FB77039B67C30695878f506313/token-transfer">
            {t("page.titlePaymentLogs")}
          </Link>
        </Modal.Header>
        <Modal.Body>
          <ProtocolLogs />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowMicroPayments(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showExamples} onClose={() => setShowExamples(false)}>
        <Modal.Header>{t("page.titleExamplePrompts")}</Modal.Header>
        <Modal.Body>
          <ExamplePrompts />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowExamples(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
