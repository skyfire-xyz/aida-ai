import { Button, Card } from "flowbite-react";

import { AppDispatch } from "@/src/store";
import { useDispatch, useSelector } from "react-redux";
import {
  redeemClaims,
  useBalanceSelector,
  useDashboardSelector,
  useWalletBalanceSelector,
} from "@/src/app/reducers/dashboardSlice";
import { Wallet } from "@/src/app/reducers/types";
import { MdDelete } from "react-icons/md";
import { ServiceImage } from "../../services/components/ServiceManager";
import { useFormatter } from "next-intl";
import { useRouter } from "next/navigation";

interface ServiceProps {
  walletType: string;
  wallet: Wallet;
}

function formatBalance(balance: number) {
  if (!balance) return 0;
  return Number(balance / 1000000);
}

export default function Service({ walletType, wallet }: ServiceProps) {
  const format = useFormatter();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { reservedWallets } = useSelector(useDashboardSelector);

  const { total, escrow, liabilities } = wallet.balance || {};

  const reservedWalletInfo = reservedWallets[walletType].find((w: Wallet) => {
    return w.address === wallet.address;
  });

  return (
    <Card className={`mb-4 bg-[#ffffff] transition-all dark:text-white`}>
      <div className="flex gap-10">
        <div className="flex gap-4">
          <ServiceImage service={reservedWalletInfo?.name || "No Name"} />
          <div>
            <h4 className="text-xl font-bold">
              {reservedWalletInfo?.name || "No Name"}
            </h4>
            <div className="mt-1 text-xs">
              <div>
                <b>Address: </b>
                {wallet.address}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 dark:text-white">
          <div>
            <span className="flex items-center">Balance</span>
            <h5 className="font-bold tracking-tight">
              {format.number(Number((total || 0) / 1000000), {
                style: "currency",
                currency: "USD",
              })}
            </h5>
          </div>
          <div>
            <span>Escrowed</span>
            <h5 className="text-gray-90 font-bold tracking-tight">
              {format.number(Number((escrow?.total || 0) / 1000000), {
                style: "currency",
                currency: "USD",
              })}
            </h5>
          </div>
          {walletType === "Sender" && (
            <div>
              <span>Liability</span>
              <h5 className="text-gray-90 font-bold tracking-tight">
                {format.number(Number((liabilities || 0) / 1000000), {
                  style: "currency",
                  currency: "USD",
                })}
              </h5>
            </div>
          )}
          {walletType === "Receiver" && (
            <div>
              <span>Available</span>
              <h5 className="stext-gray-90 font-bold tracking-tight">
                {format.number(Number((escrow?.available || 0) / 1000000), {
                  style: "currency",
                  currency: "USD",
                })}
              </h5>
            </div>
          )}
        </div>
        <div className="flex">
          {walletType === "Receiver" && (
            <Button
              className="inline"
              size="xs"
              // disabled={wallet.balance?.escrow?.available === 0}
              onClick={() =>
                dispatch(redeemClaims({ sourceAddress: wallet.address }))
              }
            >
              Redeem
            </Button>
          )}
          {walletType === "Sender" && (
            <Button
              className="inline-block"
              size="xs"
              onClick={() => {
                router.push(`/dashboard/wallets/fund/${wallet.address}`);
              }}
            >
              Fund
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
