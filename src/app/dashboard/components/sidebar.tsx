import { Sidebar, TextInput } from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { FaCode, FaRobot } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import {
  HiChartPie,
  HiInformationCircle,
  HiLogout,
  HiSearch,
} from "react-icons/hi";
import { HiMiniWallet } from "react-icons/hi2";
import { RiAdminLine } from "react-icons/ri";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useAuthSelector } from "../../reducers/authentication";

const ExampleSidebar: FC = function () {
  const router = useRouter();
  const pathname = usePathname();
  const auth = useSelector(useAuthSelector);

  const activeClass = "bg-gray-100 dark:bg-gray-700 cursor-pointer";
  const nonActiveClass = "cursor-pointer";
  return (
    <Sidebar aria-label="Sidebar with multi-level dropdown example">
      <div className="flex h-full flex-col justify-between py-2">
        {/* <div className=""> */}
        {/* <form className="pb-3 md:hidden">
            <TextInput
              icon={HiSearch}
              type="search"
              placeholder="Search"
              required
              size={32}
            />
          </form> */}
        <Sidebar.Items className="flex h-full flex-col">
          <Sidebar.ItemGroup>
            <Sidebar.Item
              icon={() => <HiChartPie className="h-4 w-4" />}
              onClick={() => router.push("/dashboard")}
              className={
                "/dashboard" === pathname ? activeClass : nonActiveClass
              }
            >
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item
              onClick={() => router.push("/dashboard/activity")}
              className={
                "/dashboard/activity" === pathname
                  ? activeClass
                  : nonActiveClass
              }
              icon={() => <GrTransaction className="h-4 w-4" />}
            >
              Activity
            </Sidebar.Item>
            <Sidebar.Item
              onClick={() => router.push("/dashboard/developers")}
              className={
                "/dashboard/developers" === pathname
                  ? activeClass
                  : nonActiveClass
              }
              icon={() => <FaCode className="h-4 w-4" />}
            >
              Developers
            </Sidebar.Item>
            <Sidebar.Item
              onClick={() => router.push("/dashboard/support")}
              className={
                "/dashboard/support" === pathname ? activeClass : nonActiveClass
              }
              icon={() => <HiInformationCircle className="h-4 w-4" />}
            >
              Support
            </Sidebar.Item>
          </Sidebar.ItemGroup>
          {auth.user && auth.user.isAdmin && (
            <Sidebar.ItemGroup>
              <Sidebar.Item
                icon={() => <HiMiniWallet className="h-4 w-4" />}
                onClick={() => router.push("/admin/wallets")}
                className={
                  "/admin/wallets" === pathname ? activeClass : nonActiveClass
                }
              >
                Wallet Management
              </Sidebar.Item>
              <Sidebar.Item
                icon={() => <FaRobot className="h-4 w-4" />}
                onClick={() => router.push("/admin/services")}
                className={
                  "/admin/services" === pathname ? activeClass : nonActiveClass
                }
              >
                Add Service
              </Sidebar.Item>
              <Sidebar.Item
                onClick={() => router.push("/admin/transactions")}
                className={
                  "/admin/transactions" === pathname
                    ? activeClass
                    : nonActiveClass
                }
                icon={() => <GrTransaction className="h-4 w-4" />}
              >
                Transactions
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          )}
          <Sidebar.ItemGroup className="mt-auto">
            <Sidebar.Item
              onClick={() => router.push("/logout")}
              className={nonActiveClass}
              icon={() => <HiLogout className="h-4 w-4" />}
            >
              Logout
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
        {/* </div> */}
      </div>
    </Sidebar>
  );
};

export default ExampleSidebar;
