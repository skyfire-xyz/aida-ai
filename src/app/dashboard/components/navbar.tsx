import type { FC } from "react";
import { Button, DarkThemeToggle, Navbar } from "flowbite-react";
import Image from "next/image";
import UserLoginInfo from "@/src/common/components/UserLoginInfo";

const ExampleNavbar: FC = function () {
  return (
    <Navbar fluid>
      <div className="w-full p-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Navbar.Brand href="/dashboard" className="px-2">
              <Image
                src="/images/logo-white.png"
                loading="lazy"
                alt="Skyfire"
                width="160"
                height="40"
              />
            </Navbar.Brand>
          </div>
          <div className="flex items-center gap-3">
            {/* <DarkThemeToggle /> */}
            <UserLoginInfo />
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default ExampleNavbar;
