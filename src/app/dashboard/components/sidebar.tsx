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

const ExampleSidebar: FC = function () {
  const router = useRouter();
  const pathname = usePathname();

  const activeClass = "bg-gray-100 dark:bg-gray-700 cursor-pointer";
  const nonActiveClass = "cursor-pointer";
  return (
    <Sidebar aria-label="Sidebar with multi-level dropdown example">
      <div className="flex h-full flex-col justify-between py-2">
        <div>
          <form className="pb-3 md:hidden">
            <TextInput
              icon={HiSearch}
              type="search"
              placeholder="Search"
              required
              size={32}
            />
          </form>
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item
                icon={HiChartPie}
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
                icon={GrTransaction}
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
                icon={FaCode}
              >
                Developers
              </Sidebar.Item>
              <Sidebar.Item
                onClick={() => router.push("/dashboard/support")}
                className={
                  "/dashboard/support" === pathname
                    ? activeClass
                    : nonActiveClass
                }
                icon={HiInformationCircle}
              >
                Support
              </Sidebar.Item>
            </Sidebar.ItemGroup>
            <Sidebar.ItemGroup>
              <Sidebar.Item
                onClick={() => router.push("/logout")}
                className={nonActiveClass}
                icon={HiLogout}
              >
                Logout
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </div>
      </div>
    </Sidebar>
  );
};

export default ExampleSidebar;
