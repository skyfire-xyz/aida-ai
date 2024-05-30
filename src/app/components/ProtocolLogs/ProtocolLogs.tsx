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
import { getUserBalance } from "../../reducers/authentication";

export interface ProtocolLogsProps {}

export default function ProtocolLogs({}: ProtocolLogsProps) {
  const t = useTranslations("ai");
  const dispatch = useDispatch<AppDispatch>();
  const paymentsPaneRef = useRef<HTMLDivElement>(null);
  const protocolLogs = useSelector(useProtocolLogsSelector);
  const { shouldScrollToBottom } = useSelector(useAiBotSelector);

  const { protocolLogsV2 } = useSelector(useAiBotSelector);

  useEffect(() => {
    scrollToBottom([paymentsPaneRef], () => {
      dispatch(setShouldScrollToBottom(false));
    });
  }, [shouldScrollToBottom]);

  useEffect(() => {
    // TODO: Revisit
    // dispatch(getUserBalance());
  }, [protocolLogs]);

  return (
    <div
      className="mb-4 flex-grow items-start overflow-scroll rounded-md bg-gray-900"
      ref={paymentsPaneRef}
    >
      <div className="relative mx-auto max-w-2xl p-4">
        {/* <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Logs:</span>
          </div> */}
        <div className="h-full text-gray-300" id="code">
          <ul>
            {protocolLogs.map((payment: PaymentType, index: number) => {
              if (!payment) return;
              return (
                <>
                  <li key={index} className="mb-2 flex last:font-semibold">
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
