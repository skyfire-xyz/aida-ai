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
    <aside className="bg-sidebar relative hidden h-screen w-80 shadow-xl sm:block">
      <nav className="pt-3 text-base font-semibold text-white">
        <div className="m-6 mb-10 flex justify-center">
          {/* <Image
            src="/images/logo_white.svg"
            loading="lazy"
            alt="Supermojo"
            width="160"
            height="40"
          /> */}
          {/* Skyfire */}
        </div>
        <Link
          href="/admin"
          className="active-nav-link nav-item flex items-center bg-[#193853] py-6 pl-6 text-white"
        >
          <HiOutlineWallet className="mr-2" />
          Wallet Management
        </Link>
        <Link
          href="/admin"
          className="nav-item flex items-center py-5 pl-6 text-white opacity-75 hover:opacity-100"
        >
          <HiOutlineUserCircle className="mr-2" />
          IAM & Admin
        </Link>
        <Link
          href="/admin"
          className="nav-item flex items-center py-5 pl-6 text-white opacity-75 hover:opacity-100"
        >
          <HiCurrencyDollar className="mr-2" />
          Billing
        </Link>
        <Link
          href="/admin"
          className="nav-item flex items-center py-5 pl-6 text-white opacity-75 hover:opacity-100"
        >
          <HiSupport className="mr-2" />
          Support
        </Link>
        <Link
          href="/admin"
          className="nav-item flex items-center py-5 pl-6 text-white opacity-75 hover:opacity-100"
        >
          <HiDocumentText className="mr-2" />
          Documentation
        </Link>
        <Link
          href="/admin"
          className="nav-item flex items-center py-5 pl-6 text-white opacity-75 hover:opacity-100"
        >
          <HiUserGroup className="mr-2" />
          Team
        </Link>
        <Link
          href="/admin"
          className="nav-item flex items-center py-5 pl-6 text-white opacity-75 hover:opacity-100"
        >
          <HiUserCircle className="mr-2" />
          My Profile
        </Link>
      </nav>
    </aside>
  );
}
