import { useTranslations } from "next-intl";
import DataSource from "./DataSource";
import { Card } from "flowbite-react";

export default function ExamplePrompts() {
  const t = useTranslations("ai");
  return (
    <Card>
      <ul>
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
        <li className="mb-1">
          <DataSource sourceName="ChatGPT" />
          <DataSource sourceName="Perplexity" />
          {t.rich("examplePrompts.other", {
            b: (chunks) => <b>{chunks}</b>,
          })}
        </li>
      </ul>
    </Card>
  );
}
