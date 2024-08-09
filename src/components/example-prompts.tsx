import { useTranslations } from "next-intl";
import DataSource from "./service-icons";
import { receivers } from "../config/receivers";

export default function ExamplePrompts() {
  const t = useTranslations("ai");
  return (
    <ul className="text-sm">
      {receivers.map((config) => {
        if (config.examplePrompt) {
          return (
            <li className="mb-1" key={config.typeName}>
              <DataSource sourceName={config.sourceName} />
              {config.examplePrompt}
            </li>
          );
        }
      })}
      <li className="mb-1">
        <DataSource sourceName="ChatGPT" />
        {t.rich("examplePrompts.other", {
          b: (chunks) => <b>{chunks}</b>,
        })}
      </li>
    </ul>
  );
}
