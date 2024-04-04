import {
  HiDocument,
  HiDocumentText,
  HiOutlineUserCircle,
  HiSupport,
  HiUserCircle,
  HiUserGroup,
} from "react-icons/hi";
import { HiOutlineWallet, HiCurrencyDollar } from "react-icons/hi2";
import Image from "next/image";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="relative bg-sidebar h-screen w-80 hidden sm:block shadow-xl">
      <nav className="text-white text-base font-semibold pt-3">
        <div className="m-6 mb-20 flex justify-center">
          <Image
            src="/images/logo_white.svg"
            loading="lazy"
            alt="Supermojo"
            width="160"
            height="40"
          />
        </div>
        <Link
          href="/admin"
          className="flex items-center active-nav-link text-white py-6 pl-6 nav-item bg-[#193853]"
        >
          <HiOutlineWallet className="mr-2" />
          Wallet Management
        </Link>
        <Link
          href="/admin"
          className="flex items-center text-white opacity-75 hover:opacity-100 py-5 pl-6 nav-item"
        >
          <HiOutlineUserCircle className="mr-2" />
          IAM & Admin
        </Link>
        <Link
          href="/admin"
          className="flex items-center text-white opacity-75 hover:opacity-100 py-5 pl-6 nav-item"
        >
          <HiCurrencyDollar className="mr-2" />
          Billing
        </Link>
        <Link
          href="/admin"
          className="flex items-center text-white opacity-75 hover:opacity-100 py-5 pl-6 nav-item"
        >
          <HiSupport className="mr-2" />
          Support
        </Link>
        <Link
          href="/admin"
          className="flex items-center text-white opacity-75 hover:opacity-100 py-5 pl-6 nav-item"
        >
          <HiDocumentText className="mr-2" />
          Documentation
        </Link>
        <Link
          href="/admin"
          className="flex items-center text-white opacity-75 hover:opacity-100 py-5 pl-6 nav-item"
        >
          <HiUserGroup className="mr-2" />
          Team
        </Link>
        <Link
          href="/admin"
          className="flex items-center text-white opacity-75 hover:opacity-100 py-5 pl-6 nav-item"
        >
          <HiUserCircle className="mr-2" />
          My Profile
        </Link>
      </nav>
    </aside>
  );
}
