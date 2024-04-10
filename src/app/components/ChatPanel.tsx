import { useDispatch, useSelector } from "react-redux";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import { IoIosInformationCircleOutline } from "react-icons/io";

import ChatGeneral from "./ChatMessages/ChatGeneral";
import ChatDataset from "./ChatMessages/ChatDataset";
import { useEffect, useRef, useState } from "react";
import BouncingDotsLoader from "./BouncingLoader";
import { getLogoAIData, scrollToBottom } from "./utils";
import { ChatMessageType, PaymentType } from "./types";
import ExamplePrompts from "./ExamplePrompts";
import { Button, Modal, TextInput } from "flowbite-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import ChatTaskList, { ChatTaskListProps } from "./ChatMessages/ChatTasklist";
import ChatWebSearch from "./ChatMessages/ChatWebSearch";
import ChatVideoSearch from "./ChatMessages/ChatVideoSearch";
import {
  addInitialMessage,
  addMessage,
  addProtocolLog,
  fetchAnalyzeDataset,
  fetchChat,
  fetchDataset,
  fetchImageGeneration,
  fetchLogoAgent,
  fetchMeme,
  fetchTasklist,
  fetchVideoSearch,
  fetchWebSearch,
  setBotStatus,
  useAiBotSelector,
} from "../reducers/aiBotSlice";
import { AppDispatch } from "@/src/store";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function ChatPane(props: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, status } = useSelector(useAiBotSelector);

  const t = useTranslations("ai");
  const [inputText, setInputText] = useState("");
  const [showExamples, setShowExamples] = useState(false);
  const [showMicroPayments, setShowMicroPayments] = useState(false);

  const chatMessages = useRef<ChatMessageType[]>([]);
  const chatPaneRef = useRef<HTMLDivElement>(null);

  const {
    protocolLogs,
    setProtocolLogs,
    paymentsPaneRef,
    ProtocolLogsComp,
    robotImageUrl,
    userImageUrl,
  } = props;

  // Common Utilities
  const addBotResponseMessage = (
    prompt: string,
    data?: any,
    type?: "chat" | "dataset" | "tasklist" | "websearch" | "videosearch"
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
    dispatch(setBotStatus(true));
    setTimeout(() => {
      dispatch(setBotStatus(false));
      // TODO: Figure out why this useEffect called twice
      dispatch(
        addInitialMessage({
          textMessage: t("aiPrompt.defaultGreeting"),
        })
      );
    }, 1000);
  }, [messages]);

  // Datasets Utilities
  const handleDatasetBeforeAnalyze = async (data: any) => {
    dispatch(
      addMessage({
        type: "chat",
        textMessage: t("aiPrompt.textAnalyzeDataset", { dataset: data.title }),
      })
    );
    scrollToBottom([chatPaneRef, paymentsPaneRef]);
  };

  const handleDatasetAnalyze = async (ref: string) => {
    dispatch(fetchAnalyzeDataset({ ref }));
    scrollToBottom([chatPaneRef, paymentsPaneRef]);
  };

  const handleTasklistBeforeExecute = async (taskName: string) => {
    dispatch(
      addMessage({
        type: "chat",
        textMessage: t("aiPrompt.textExecuteTasks", { task: taskName }),
      })
    );
    scrollToBottom([chatPaneRef, paymentsPaneRef]);
  };

  const handleTasklistExecute = async (
    results: ChatTaskListProps["results"]
  ) => {
    // Recursively execute AI prompts
    for (const result of results) {
      if (result.skill === "text_completion") {
        dispatch(fetchChat({ prompt: result.task }));
      } else if (result.skill === "image_generation") {
        dispatch(fetchChat({ prompt: `Generate image: ${result.task}` }));
      }
      scrollToBottom([chatPaneRef, paymentsPaneRef]);
    }
  };

  const handleDatasetBeforeDownload = async (data: any) => {
    dispatch(
      addMessage({
        type: "chat",
        textMessage: t("aiPrompt.textDownloadDataset", { dataset: data.title }),
      })
    );
    scrollToBottom([chatPaneRef, paymentsPaneRef]);
  };

  const handleDatasetDownload = async (payment: PaymentType) => {
    dispatch(addProtocolLog({ payload: { payment } }));
  };

  // Process User Input
  const handleEnter = async (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === "Enter") {
      dispatch(
        addMessage({
          type: "chat",
          direction: "right",
          avatarUrl: userImageUrl,
          textMessage: inputText,
        })
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
            })
          );
          scrollToBottom([chatPaneRef, paymentsPaneRef]);
          return;
        }
        dispatch(fetchDataset({ searchTerm }));
        scrollToBottom([chatPaneRef, paymentsPaneRef]);
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
          scrollToBottom([chatPaneRef, paymentsPaneRef]);
          return;
        }

        dispatch(fetchTasklist({ searchTerm }));
        scrollToBottom([chatPaneRef, paymentsPaneRef]);
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
          scrollToBottom([chatPaneRef, paymentsPaneRef]);
          return;
        }

        dispatch(fetchWebSearch({ searchTerm }));
        scrollToBottom([chatPaneRef, paymentsPaneRef]);
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
          scrollToBottom([chatPaneRef, paymentsPaneRef]);
          return;
        }

        dispatch(fetchVideoSearch({ searchTerm }));
        scrollToBottom([chatPaneRef, paymentsPaneRef]);
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
          scrollToBottom([chatPaneRef, paymentsPaneRef]);
          return;
        }

        // Generate Image API
        dispatch(fetchImageGeneration({ searchTerm }));
        scrollToBottom([chatPaneRef, paymentsPaneRef]);
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
          scrollToBottom([chatPaneRef, paymentsPaneRef]);
          return;
        }

        dispatch(fetchMeme({ searchTerm, meme: true }));
        scrollToBottom([chatPaneRef, paymentsPaneRef]);
      } else if (inputText.includes("joke")) {
        ///////////////////////////////////////////////////////////
        // Joke Request
        ///////////////////////////////////////////////////////////

        dispatch(fetchMeme({ searchTerm: "", meme: false }));
        scrollToBottom([chatPaneRef, paymentsPaneRef]);
      } else {
        ///////////////////////////////////////////////////////////
        // Regular Chat Requeste
        ///////////////////////////////////////////////////////////

        if (
          inputText.toLocaleLowerCase().includes("logo") &&
          inputText.toLocaleLowerCase().includes("now")
        ) {
          // Logo request after creating a wallet on admin console
          const logoAIAgent = getLogoAIData();
          dispatch(fetchLogoAgent({ logoAIAgent }));
          scrollToBottom([chatPaneRef, paymentsPaneRef]);
        } else {
          // Logo request before creating a wallet
          dispatch(fetchChat({ prompt: inputText }));
          scrollToBottom([chatPaneRef, paymentsPaneRef]);

          if (inputText.toLocaleLowerCase().includes("logo")) {
            dispatch(setBotStatus(true));
            setTimeout(() => {
              dispatch(setBotStatus(false));
              dispatch(
                addMessage({
                  type: "chat",
                  textMessage: t("aiPrompt.textVisitAdminDashboard"),
                })
              );
              scrollToBottom([chatPaneRef, paymentsPaneRef]);
            }, 1000);
          }
        }
      }

      if (ev.preventDefault) ev.preventDefault();
    }
  };

  return (
    <div className="w-full flex flex-col justify-between h-full">
      <div
        id="chat-pane"
        className="flex flex-col mt-5 overflow-scroll flex-grow px-5 "
        ref={chatPaneRef}
      >
        {messages &&
          messages.map((message, index) => {
            if (message.type === "dataset") {
              return (
                <ChatDataset
                  avatarUrl={message.avatarUrl}
                  key={index}
                  textMessage=""
                  dataset={message.data}
                  onBeforeDownload={handleDatasetBeforeDownload}
                  onDownload={handleDatasetDownload}
                  onBeforeAnalyze={handleDatasetBeforeAnalyze}
                  onAnalyze={handleDatasetAnalyze}
                />
              );
            } else if (message.type === "tasklist") {
              return (
                <ChatTaskList
                  avatarUrl={message.avatarUrl}
                  key={index}
                  textMessage=""
                  results={message.data}
                  onBeforeExecute={handleTasklistBeforeExecute}
                  onExecute={handleTasklistExecute}
                />
              );
            } else if (message.type === "websearch") {
              return (
                <ChatWebSearch
                  key={index}
                  direction={message.direction}
                  avatarUrl={message.avatarUrl}
                  textMessage={message.textMessage}
                  results={message.data}
                />
              );
            } else if (message.type === "videosearch") {
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
      <div className="md:pt-5 py-5 px-3 flex-none pt-1">
        <div className="flex justify-end md:hidden mb-2">
          <HiOutlineCurrencyDollar
            className="w-5 h-5"
            onClick={() => setShowMicroPayments(true)}
          />
          <IoIosInformationCircleOutline
            className="w-5 h-5"
            onClick={() => setShowExamples(true)}
          />
        </div>
        <TextInput
          className="w-full rounded-xl bg-[#f7f9fa]"
          placeholder={t("page.chatPlaceholder")}
          value={inputText}
          onChange={(ev) => {
            setInputText(ev?.target?.value);
          }}
          onKeyDown={handleEnter}
        ></TextInput>
        {/* <TextField
          className="w-full rounded-xl bg-[#f7f9fa]"
          variant="outlined"
          placeholder={t("page.chatPlaceholder")}
          value={inputText}
          onChange={(ev) => {
            setInputText(ev?.target?.value);
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" className="bg-[#f7f9fa]">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => {
                    handleEnter({ key: "Enter" } as any);
                  }}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          onKeyDown={handleEnter}
        /> */}
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
          <ProtocolLogsComp />
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
