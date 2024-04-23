import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { defaultImageLoader } from "@/src/common/lib/imageLoaders";

const Header: React.FC = () => {
  const t = useTranslations("ai");

  return (
    <div>
      <div
        data-animation="default"
        className={`navbar w-nav animation-header open`}
        data-easing2="ease"
        data-easing="ease"
        data-collapse="medium"
        role="banner"
        data-no-scroll="1"
        data-duration="400"
      >
        <div
          className="px-10 py-10 md:px-40"
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
            <h2 className="text-4xl text-white">{t("page.title")}</h2>
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
      </div>
    </div>
  );
};

export default Header;
