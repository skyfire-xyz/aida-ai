import { Breadcrumb } from "flowbite-react";
import WalletManager from "../../components/wallets/components/WalletManager";
import { HiHome } from "react-icons/hi";

export default function Wallets() {
  return (
    <div>
      <Breadcrumb aria-label="Default breadcrumb example mb-20">
        <Breadcrumb.Item href="/dashboard" icon={HiHome}>
          Dashboard
        </Breadcrumb.Item>
        <Breadcrumb.Item>Fund & Withdraw</Breadcrumb.Item>
      </Breadcrumb>
      <WalletManager />
    </div>
  );
}
