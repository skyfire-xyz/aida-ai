import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { defaultImageLoader } from "@/src/common/lib/imageLoaders";
import { useDispatch, useSelector } from "react-redux";
import { setUser, useAuthSelector } from "../reducers/authentication";
import { Card } from "flowbite-react";
import { AppDispatch } from "@/src/store";
import { HiLogout } from "react-icons/hi";
import UserLoginInfo from "../../common/components/UserLoginInfo";

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const t = useTranslations("ai");
  const auth = useSelector(useAuthSelector);

  return (
    <div className="container mx-auto">
      <div className="items-center justify-between md:flex">
        <div
          className="py-10"
          // className={`container-medium navbar_container w-container ${
          //   open ? styles.navbar_container_open : ""
          // } !pt-[34px]`}
        >
          <Link
            href="/"
            aria-current="page"
            className={`brand w-nav-brand w--current`}
            aria-label="home"
          >
            {/* <Typography
              variant="h2"
              sx={{ fontSize: "36px", fontWeight: "700" }}
            > */}
            <h2 className="text-4xl font-bold text-white">{t("page.title")}</h2>
            {/* </Typography> */}
            <div className="flex items-center">
              <h3 className="mdL:text-xl mr-1 text-white">
                <i>{t("page.poweredBy")}</i>
              </h3>
              <div>
                <Image
                  src="/images/logo-only.png"
                  loading="lazy"
                  alt="Skyfire"
                  width="36"
                  height="24"
                  loader={defaultImageLoader}
                />
              </div>
            </div>
          </Link>
        </div>
        <UserLoginInfo />
        {/* {auth.user && (
          <div className="text-white">
            <div className="flex items-center">
              <img
                src={auth.user.avatar}
                className="mr-2 h-12 w-12 rounded-full object-cover"
                alt=""
              />
              <div className="text-sm">
                Username: <b>{auth.user.username}</b>
                <p>
                  Balance: <b>$0.00</b>
                </p>
              </div>
              <Link
                className="ml-4 flex items-center"
                href={"#"}
                onClick={() => {
                  dispatch(setUser({}));
                }}
              >
                <span className="ml-1 text-xs">Log out</span>
              </Link>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Header;
