import DataSource from "./DataSource";
import ChatPanel from "./ChatPanel";
import { useRef, useState } from "react";
import { PaymentType } from "./types";
import ExamplePrompts from "./ExamplePropts";
import Link from "next/link";
import { useTranslations } from "next-intl";

type Image = any;
interface AiChatProps {
  images: Image[];
}

export default function AiChat({ images }: AiChatProps) {
  const t = useTranslations("ai");
  const [protocolLogs, setProtocolLogs] = useState<PaymentType[]>([]);
  const paymentsPaneRef = useRef<HTMLDivElement>(null);
  // const userAvatarImageData = getStrapiDataAttributes(
  //   images?.find((data) => data.attributes.name === "userAvatar")
  // );
  // const botAvatarImageData = getStrapiDataAttributes(
  //   images?.find((data) => data.attributes.name === "botAvatar")
  // );
  // const botImageData = getStrapiDataAttributes(
  //   images?.find((data) => data.attributes.name === "botImageWide")
  // );

  const userAvatarImageData = {};
  const botAvatarImageData = {};
  const botImageData = {};

  const ProtocolLogs = () => {
    return (
      <div
        className="flex-grow items-start mb-4 overflow-scroll bg-gray-900 rounded-md"
        ref={paymentsPaneRef}
      >
        <div className="relative max-w-2xl mx-auto p-4">
          {/* <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Logs:</span>
          </div> */}
          <div className="h-full text-gray-300" id="code">
            <ul>
              {protocolLogs.map((payment: PaymentType, index: number) => {
                if (!payment) return;
                return (
                  <>
                    <li key={index} className="last:font-semibold mb-2 flex">
                      <DataSource sourceName={payment.destinationName} />
                      <div className="">
                        <span className="block">
                          {t("paymentLogs.textQuote", {
                            destination: `${payment.destinationName} 
                            ${
                              payment.destinationName === "KaggleAI"
                                ? "data"
                                : "service"
                            }`,
                            amount: Number(payment.amount) / 1000000,
                          })}
                        </span>
                        {payment.status === "SUCCESS" && (
                          <span className="block text-teal-500">
                            {t("paymentLogs.textQuotePaidTo", {
                              amount: Number(payment.amount) / 1000000,
                              currency: payment.currency,
                              destination: payment.destinationName,
                            })}
                          </span>
                        )}
                        {payment.status === "DENIED" && (
                          <span className="block text-rose-500">
                            {t("paymentLogs.textQuoteRejected", {
                              errorMessage: payment.message,
                            })}
                          </span>
                        )}
                      </div>
                    </li>
                  </>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="0 flex-grow h-full">
      <div className="container mx-auto shadow-lg rounded-lg h-full">
        {/* <div className="px-5 py-5 flex justify-between items-center bg-white border-b-2">
          <div className="font-semibold text-2xl">
          <div>
            <div className="h-12 w-12 p-2 bg-[#FA722A] rounded-full text-white font-semibold flex items-center justify-center">
              KOJI
            </div>
          </div>
        </div> */}
        <div className="md:flex md:flex-row sm:flex-col justify-between bg-white h-full rounded-lg">
          <ChatPanel
            paymentsPaneRef={paymentsPaneRef}
            protocolLogs={protocolLogs}
            setProtocolLogs={setProtocolLogs}
            ProtocolLogsComp={ProtocolLogs}
            userImageUrl={
              userAvatarImageData?.url ||
              "https://avatars.githubusercontent.com/u/5210813?v=4"
            }
            robotImageUrl={
              botAvatarImageData?.url || "/images/aichat/ai-robot.png"
            }
          />
          <div className="w-2/5 border-l-2 px-5 pt-5 md:block hidden">
            <div className="flex flex-col h-full">
              <img
                src={botImageData?.url || "/images/aichat/ai-robot-flat.png"}
                className="object-cover rounded-xl h-28 w-240px"
                alt=""
              />
              <div>
                <p className="font-bold mt-6">
                  {t("page.titleExamplePrompts")}
                </p>
                <ExamplePrompts />
              </div>
              <p className="font-bold mt-4">
                <Link
                  href="https://mumbai.polygonscan.com/address/0x45c83889BD84D5FB77039B67C30695878f506313#tokentxns"
                  target="_blank"
                >
                  <b>{t("page.titlePaymentLogs")}</b>
                </Link>
              </p>
              <ProtocolLogs />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
