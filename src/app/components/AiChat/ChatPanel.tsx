import axios from "axios";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import { IoIosInformationCircleOutline } from "react-icons/io";

import ChatMessage from "./ChatMessage";
import ChatDataset from "./ChatDataset";
import { useEffect, useRef, useState } from "react";
import BouncingDotsLoader from "./BouncingLoader";
import { getLogoAIData, scrollToBottom } from "./utils";
import { ChatMessageType, PaymentType } from "./types";
import ExamplePrompts from "./ExamplePropts";
import { Button, Modal, TextInput } from "flowbite-react";
import { BACKEND_API_URL } from "@/src/common/lib/constant";
import { useTranslations } from "next-intl";
import Link from "next/link";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function ChatPane(props: any) {
  const t = useTranslations("ai");
  const [inputText, setInputText] = useState("");
  const [botThinking, setBotThinking] = useState(false);
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
    type?: "chat" | "dataset"
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

  const processProtocolLogs = (data: any) => {
    const logs: PaymentType[] = data?.quote || [data?.payment];
    if (logs) {
      setProtocolLogs([...protocolLogs, ...logs]);
    }
  };

  useEffect(() => {
    setBotThinking(true);
    setTimeout(() => {
      setBotThinking(false);
      addBotResponseMessage(t("aiPrompt.defaultGreeting"));
    }, 1000);
  }, []);

  // Datasets Utilities
  const handleDatasetBeforeAnalyze = async (data: any) => {
    addBotResponseMessage(
      t("aiPrompt.textAnalyzeDataset", { dataset: data.title })
    );
    scrollToBottom([chatPaneRef, paymentsPaneRef]);
  };

  const handleDatasetAnalyze = async (ref: string) => {
    try {
      setBotThinking(true);
      const response = await axios.post(
        `${BACKEND_API_URL}v2/dataset/analyze`,
        {
          dataset: ref,
        }
      );
      addBotResponseMessage(response.data.body);
      processProtocolLogs(response?.data);
      scrollToBottom([chatPaneRef, paymentsPaneRef]);
      setBotThinking(false);
    } catch {
      setBotThinking(false);
    }
  };

  const handleDatasetBeforeDownload = async (data: any) => {
    addBotResponseMessage(
      t("aiPrompt.textDownloadDataset", { dataset: data.title })
    );
    scrollToBottom([chatPaneRef, paymentsPaneRef]);
  };

  const handleDatasetDownload = async (payment: PaymentType) => {
    setProtocolLogs([...protocolLogs, payment]);
  };

  // Process User Input
  const handleEnter = async (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === "Enter") {
      chatMessages.current = [
        ...chatMessages.current,
        {
          type: "chat",
          direction: "right",
          avatarUrl: userImageUrl,
          textMessage: inputText,
        },
      ];

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
          addBotResponseMessage(t("aiPrompt.errorMessage"));
          scrollToBottom([chatPaneRef, paymentsPaneRef]);
          setBotThinking(false);
          return;
        }

        // Dataset API
        try {
          setBotThinking(true);
          const response = await axios.post(
            `${BACKEND_API_URL}v2/dataset/search`,
            {
              searchTerm: searchTerm.trim(),
            }
          );
          addBotResponseMessage(
            response.data.body,
            response.data.datasets || [],
            "dataset"
          );
          scrollToBottom([chatPaneRef, paymentsPaneRef]);
          setBotThinking(false);
        } catch {
          setBotThinking(false);
        }
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
          setBotThinking(false);
          return;
        }

        // Meme API
        try {
          setBotThinking(true);
          const response = await axios.post(`${BACKEND_API_URL}v2/joke`, {
            meme: true,
            searchTerm: searchTerm.trim(),
          });
          addBotResponseMessage(
            response.data.body || response.data.joke,
            response.data.memeUrl
          );
          processProtocolLogs(response?.data);
          scrollToBottom([chatPaneRef, paymentsPaneRef]);
          setBotThinking(false);
        } catch {
          setBotThinking(false);
        }
      } else if (inputText.includes("joke")) {
        ///////////////////////////////////////////////////////////
        // Joke Request
        ///////////////////////////////////////////////////////////
        try {
          setBotThinking(true);
          const response = await axios.post(`${BACKEND_API_URL}v2/joke`, {
            meme: false,
          });

          addBotResponseMessage(
            response.data.body || response.data.joke,
            response.data.memeUrl
          );
          processProtocolLogs(response?.data);
          scrollToBottom([chatPaneRef, paymentsPaneRef]);
          setBotThinking(false);
        } catch {
          setBotThinking(false);
        }
      } else {
        ///////////////////////////////////////////////////////////
        // Regular Chat Requeste
        ///////////////////////////////////////////////////////////

        if (
          inputText.toLocaleLowerCase().includes("logo") &&
          inputText.toLocaleLowerCase().includes("now")
        ) {
          // Logo request after creating a wallet on admin console
          try {
            setBotThinking(true);
            const logoAIAgent = getLogoAIData();

            const response = await axios.post(`${BACKEND_API_URL}v2/logo`, {
              agent: logoAIAgent.service,
              cost: logoAIAgent.price,
            });
            addBotResponseMessage(response.data.body, response.data.logoUrl);
            processProtocolLogs(response?.data);
            scrollToBottom([chatPaneRef, paymentsPaneRef]);
            setBotThinking(false);
          } catch {
            setBotThinking(false);
          }
        } else {
          // Logo request before creating a wallet
          try {
            setBotThinking(true);
            const response = await axios.post(`${BACKEND_API_URL}v2/chat`, {
              prompt: inputText,
            });

            addBotResponseMessage(response.data.body);
            processProtocolLogs(response?.data);
            scrollToBottom([chatPaneRef, paymentsPaneRef]);
            setBotThinking(false);
          } catch {
            setBotThinking(false);
          }
          if (inputText.toLocaleLowerCase().includes("logo")) {
            setBotThinking(true);
            setTimeout(() => {
              addBotResponseMessage(t("aiPrompt.textVisitAdminDashboard"));
              setBotThinking(false);
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
        {chatMessages.current.map((message, index) => {
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
          }
          return (
            <ChatMessage
              key={index}
              direction={message.direction}
              avatarUrl={message.avatarUrl}
              textMessage={message.textMessage}
              contentImageUrl={message.data}
            />
          );
        })}

        {botThinking && (
          <ChatMessage direction="left" avatarUrl={robotImageUrl}>
            <BouncingDotsLoader />
          </ChatMessage>
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
          <Link href="https://mumbai.polygonscan.com/address/0x45c83889BD84D5FB77039B67C30695878f506313#tokentxns">
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
