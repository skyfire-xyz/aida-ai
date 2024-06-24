import { useTranslations } from "next-intl";
import DataSource from "./service-icons";
import { receiverConfigs } from "../config/receivers";

export default function ExamplePrompts() {
  const t = useTranslations("ai");
  return (
    <ul className="text-sm">
      <li className="mb-1">
        <DataSource sourceName="KaggleAI" />
        {t.rich("examplePrompts.search", {
          b: (chunks) => <b>{chunks}</b>,
        })}
      </li>
      <li className="mb-1">
        <DataSource sourceName="HumorAI" />
        {t.rich("examplePrompts.image", {
          b: (chunks) => <b>{chunks}</b>,
        })}
      </li>
      <li className="mb-1">
        <DataSource sourceName="ChatGPT" />
        {t.rich("examplePrompts.generateImage", {
          b: (chunks) => <b>{chunks}</b>,
        })}
      </li>
      <li className="mb-1">
        <DataSource sourceName="ChatGPT" />
        {t.rich("examplePrompts.taskList", {
          b: (chunks) => <b>{chunks}</b>,
        })}
      </li>
      <li className="mb-1">
        <DataSource sourceName="Gemini" />
        {t.rich("examplePrompts.websearch", {
          b: (chunks) => <b>{chunks}</b>,
        })}
      </li>
      <li className="mb-1">
        <DataSource sourceName="Gemini" />
        {t.rich("examplePrompts.videosearch", {
          b: (chunks) => <b>{chunks}</b>,
        })}
      </li>
      {receiverConfigs.map((config) => (
        <li className="mb-1" key={config.typeName}>
          <DataSource sourceName={config.sourceName} />
          {config.examplePrompt}
        </li>
      ))}
      <li className="mb-1">
        <DataSource sourceName="ChatGPT" />
        <DataSource sourceName="Perplexity" />
        {t.rich("examplePrompts.other", {
          b: (chunks) => <b>{chunks}</b>,
        })}
      </li>
    </ul>
  );
}
