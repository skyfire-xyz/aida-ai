import Image from "next/image";
import WalletManager from "./WalletManager/WalletManager";
import { defaultImageLoader } from "src/imageLoaders";
import Signup from "./Signup";

interface AdminPanelProps {}

function Onboard({}: AdminPanelProps) {
  return (
    <div className="flex h-full">
      {/* <aside className="relative bg-sidebar h-screen w-80 hidden sm:block shadow-xl"> */}
      {/* <nav className="text-white text-base font-semibold pt-3">
          <div className="m-6 mb-20 flex justify-center">
            <Image
              src="/images/logo_white.svg"
              loading="lazy"
              alt="Supermojo"
              width="160"
              height="40"
              loader={defaultImageLoader}
            />
          </div>
          <Link
            href="/admin"
            className="flex items-center active-nav-link text-white py-6 pl-6 nav-item bg-[#193853]"
          >
            <AccountBalanceWalletIcon className="mr-2" />
            Wallet Management
          </Link>
          <Link
            href="/admin"
            className="flex items-center text-white opacity-75 hover:opacity-100 py-5 pl-6 nav-item"
          >
            <SupervisorAccountIcon className="mr-2" />
            IAM & Admin
          </Link>
          <Link
            href="/admin"
            className="flex items-center text-white opacity-75 hover:opacity-100 py-5 pl-6 nav-item"
          >
            <ReceiptLongIcon className="mr-2" />
            Billing
          </Link>
          <Link
            href="/admin"
            className="flex items-center text-white opacity-75 hover:opacity-100 py-5 pl-6 nav-item"
          >
            <SupportAgentIcon className="mr-2" />
            Support
          </Link>
          <Link
            href="/admin"
            className="flex items-center text-white opacity-75 hover:opacity-100 py-5 pl-6 nav-item"
          >
            <ArticleIcon className="mr-2" />
            Documentation
          </Link>
          <Link
            href="/admin"
            className="flex items-center text-white opacity-75 hover:opacity-100 py-5 pl-6 nav-item"
          >
            <GroupsIcon className="mr-2" />
            Team
          </Link>
          <Link
            href="/admin"
            className="flex items-center text-white opacity-75 hover:opacity-100 py-5 pl-6 nav-item"
          >
            <AccountBoxIcon className="mr-2" />
            My Profile
          </Link>
        </nav> */}
      {/* </aside> */}
      <div className="flex-grow container shadow-lg h-full bg-[#002341] rounded-lg max-w-[none]">
        <div className="h-24 bg-[#002341] p-6">
          <Image
            src="/images/logo_white.svg"
            loading="lazy"
            alt="Supermojo"
            width="160"
            height="40"
            loader={defaultImageLoader}
          />
        </div>
        <div className="flex justify-between bg-slate-50 h-[calc(100%-120px)] rounded-lg mx-6">
          {/* <WalletManager /> */}
          <Signup />
        </div>
      </div>
    </div>
  );
}

export default Onboard;
