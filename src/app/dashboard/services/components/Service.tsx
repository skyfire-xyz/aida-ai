import { Card } from "flowbite-react";
import { ServiceImage } from "../../services/components/ServiceManager";
import { AppDispatch } from "@/src/store";
import { useDispatch, useSelector } from "react-redux";
import { useDashboardSelector } from "@/src/app/reducers/dashboardSlice";
import { Wallet } from "@/src/app/reducers/types";
import { MdDelete } from "react-icons/md";

interface ServiceProps {
  walletType: string;
  wallet: Wallet;
}

export default function Service({ walletType, wallet }: ServiceProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { status, transactions, wallets, reservedWallets } =
    useSelector(useDashboardSelector);

  const reservedWalletInfo = reservedWallets[walletType].find((w: Wallet) => {
    return w.address === wallet.address;
  });

  return (
    <Card className={`mb-4 bg-[#ffffff] transition-all dark:text-white`}>
      <div className="flex gap-4">
        <div>
          <ServiceImage service={reservedWalletInfo?.name || "No Name"} />
        </div>
        <div className="flex-1">
          <h4 className="text-xl font-bold">
            {reservedWalletInfo?.name || "No Name"}
          </h4>
          <div className="mt-1 text-xs">
            <div>
              <b>Address: </b>
              {wallet.address}
            </div>
            <div>
              <b>Created At: </b>
              {wallet.createdAt}
            </div>
          </div>
        </div>
        <div>
          {!reservedWalletInfo && (
            <div className="flex items-center">
              <MdDelete className="mr-2" />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
