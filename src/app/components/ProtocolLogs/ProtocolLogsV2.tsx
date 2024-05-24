import { useEffect, useRef } from "react";
import DataSource from "../DataSource";
import { PaymentType } from "../types";
import { useDispatch, useSelector } from "react-redux";
import {
  setShouldScrollToBottom,
  useAiBotSelector,
  useProtocolLogsSelector,
} from "../../reducers/aiBotSlice";
import { useTranslations } from "next-intl";
import { scrollToBottom } from "../utils";
import { AppDispatch } from "@/src/store";

export interface ProtocolLogsProps {}

export default function ProtocolLogs({}: ProtocolLogsProps) {
  const t = useTranslations("ai");
  const dispatch = useDispatch<AppDispatch>();
  const paymentsPaneRef = useRef<HTMLDivElement>(null);
  const protocolLogs = useSelector(useProtocolLogsSelector);
  const { shouldScrollToBottom } = useSelector(useAiBotSelector);

  useEffect(() => {
    scrollToBottom([paymentsPaneRef], () => {
      dispatch(setShouldScrollToBottom(false));
    });
  }, [shouldScrollToBottom]);

  return (
    <div
      className="flex-grow items-start mb-4 overflow-scroll bg-gray-900 rounded-md"
      ref={paymentsPaneRef}
    >
      <div className="relative max-w-2xl mx-auto p-4">
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
}