import { postChat } from "../redux/thunk-actions";
import { Receiver } from "../types/receiver";

export const receiverConfigs: Receiver[] = [
  ///////////////////////////////////////////////////////////
  // Open Router - Slang
  ///////////////////////////////////////////////////////////
  new Receiver({
    typeName: "slang",
    proxyName: "chatSlangOpenRouter",
    sourceName: "OpenRouter",
    logoImageURL: "/images/aichat/logo-openrouter.png",
    examplePrompt: (
      <>
        <b>Slang</b>: drip
      </>
    ),
    promptHandler: async (inputText, context) => {
      const { dispatch, addBotResponseMessage, t } = context;
      if (inputText.toLocaleLowerCase().includes("slang")) {
        let searchTerm = "";

        const match = inputText.match(/slang:(.+)/i);
        if (match) {
          searchTerm = match[1];
        }

        if (!searchTerm) {
          addBotResponseMessage(t("aiPrompt.errorMessage"));
          return true;
        }

        dispatch(
          postChat({
            chatType: "slang",
            data: { prompt: searchTerm.trim() },
          }),
        );
        return true;
      }
      return false;
    },
  }),
  ///////////////////////////////////////////////////////////
  // Open Router - Flirt
  ///////////////////////////////////////////////////////////
  new Receiver({
    typeName: "flirt",
    proxyName: "chatTranslateOpenRouter",
    sourceName: "OpenRouter",
    logoImageURL: "/images/aichat/logo-openrouter.png",
    examplePrompt: (
      <>
        <b>Flirt</b>: Greet pretty person
      </>
    ),
    promptHandler: async (inputText, context) => {
      const { dispatch, addBotResponseMessage, t } = context;
      if (inputText.toLocaleLowerCase().includes("flirt")) {
        let searchTerm = "";

        const match = inputText.match(/flirt:(.+)/i);
        if (match) {
          searchTerm = match[1];
        }

        if (!searchTerm) {
          addBotResponseMessage(t("aiPrompt.errorMessage"));
          return true;
        }

        dispatch(
          postChat({
            chatType: "flirt",
            data: {
              situation: searchTerm.trim(),
              sourceLang: "english",
              targetLang: "spanish",
            },
          }),
        );
        return true;
      }
      return false;
    },
  }),
];
