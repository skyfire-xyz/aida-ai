"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, Card, Toast } from "flowbite-react";
import { MdDelete } from "react-icons/md";
import { HiCheck, HiExclamation, HiX } from "react-icons/hi";
import { MdLoop } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/src/store";
import {
  createWallet,
  fetchWallets,
  resetStatus,
  useDashboardSelector,
} from "@/src/app/reducers/dashboardSlice";
import { Wallet } from "@/src/app/reducers/types";
import { create } from "domain";

interface IFormInput {
  service: string;
  description: string;
  website: string;
  price: number;
}

const walletTypes = ["Sender", "Receiver"] as const;

/**
 * @pattern ^[a-zA-Z0-9_]+$
 * @format network
 */
export type WalletType = (typeof walletTypes)[number];

export function ServiceImage({ service }: { service: string }) {
  const imageUrl = useMemo(() => {
    if (service === "Perplexity") {
      return "/images/aichat/logo-perplexity.svg";
    } else if (service === "Joke") {
      return "/images/aichat/logo-humorapi.svg";
    } else if (service === "Dataset") {
      return "/images/aichat/logo-kaggle.svg";
    } else if (service === "ChatGPT") {
      return "/images/aichat/logo-chatgpt.svg";
    } else if (service === "Gemini") {
      return "/images/aichat/logo-gemini.svg";
    }
  }, [service]);

  if (!imageUrl && service) {
    return (
      <div className="rounded-ful flex h-12 w-12 items-center justify-center rounded-lg bg-gray-500">
        {service[0]}
      </div>
    );
  }

  return (
    <div className="flex h-12 w-12 items-center justify-center">
      <img src={imageUrl} width="50" height="50" />
    </div>
  );
}

export default function ServiceManager() {
  const dispatch = useDispatch<AppDispatch>();
  const { status, transactions, wallets, reservedWallets } =
    useSelector(useDashboardSelector);

  const [walletType, setWalletType] = useState<WalletType>("Receiver");
  const [openError, setOpenError] = useState("");
  const [openSuccess, setOpenSuccess] = useState("");
  const [openInfo, setOpenInfo] = useState("");

  const [walletAdded, setWalletAdded] = useState(false);
  const [transferFund, setTransferFund] = useState<any>(null);

  const walletList = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const getWallets = async () => {
    dispatch(fetchWallets({ walletType }));
    walletList?.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (status.createWallet === "succeeded") {
      getWallets();
      setWalletAdded(true);
      setOpenInfo("");
      setOpenSuccess("Successfully created wallet");

      // Reset
      setTimeout(() => {
        setWalletAdded(false);
        dispatch(resetStatus({ key: "createWallet", status: "idle" }));
      }, 3000);
    } else if (status.createWallet === "pending") {
      setOpenInfo("Creating wallet...");
    } else if (status.createWallet === "failed") {
      setOpenError("Sorry, the blockchain network is slow right now");

      // Reset
      setTimeout(() => {
        dispatch(resetStatus({ key: "createWallet", status: "idle" }));
      }, 3000);
    } else if (status.createWallet === "idle") {
      setOpenInfo("");
      setOpenSuccess("");
      setOpenError("");
    }
  }, [status]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    dispatch(createWallet({ data }));
  };

  useEffect(() => {
    getWallets();
  }, [walletType]);

  return (
    <div className="h-full w-full rounded-lg">
      <div className="flex w-full gap-10">
        <div className="min-w-auto flex flex-col md:min-w-[640px]">
          <div className="w-full max-w-lg">
            <h3 className="text-3xl dark:text-white">Service List</h3>
          </div>
          <div ref={walletList} className="mt-8 overflow-scroll">
            {!wallets[walletType].length && <p>No service found</p>}
            {wallets[walletType].length > 0 &&
              wallets[walletType].map((wallet: Wallet, index: number) => {
                const reservedWalletInfo = reservedWallets[walletType].find(
                  (w: Wallet) => {
                    return w.address === wallet.address;
                  },
                );

                return (
                  <Card
                    key={index}
                    className={`mb-4  ${
                      walletAdded
                        ? "first:bg-[rgb(229,246,253)]"
                        : "first:bg-[#ffffff]"
                    } bg-[#ffffff] transition-all dark:text-white`}
                  >
                    <div className="flex gap-4">
                      <div>
                        <ServiceImage
                          service={reservedWalletInfo?.name || "No Name"}
                        />
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
              })}
          </div>
        </div>

        <div className="flex w-full flex-col">
          {!!openInfo && (
            <Toast className="fixed bottom-10 left-10 z-50 max-w-sm">
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-500 dark:bg-cyan-900 dark:text-cyan-300">
                <MdLoop className="h-5 w-5 animate-spin" />
              </div>
              <div className="pl-4 text-sm font-normal">
                <div dangerouslySetInnerHTML={{ __html: openInfo }} />
              </div>
              <Toast.Toggle onClick={() => setOpenInfo("")} />
            </Toast>
          )}
          {!!openSuccess && (
            <Toast className="fixed bottom-10 left-10 z-50 max-w-sm">
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                <HiCheck className="h-5 w-5" />
              </div>
              <div className="pl-4 text-sm font-normal">
                <div dangerouslySetInnerHTML={{ __html: openSuccess }} />
              </div>
              <Toast.Toggle onClick={() => setOpenSuccess("")} />
            </Toast>
          )}
          {!!openError && (
            <Toast className="fixed bottom-10 left-10 z-50 max-w-sm">
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                <HiExclamation className="h-5 w-5" />
              </div>
              <div className="pl-4 text-sm font-normal">
                <div dangerouslySetInnerHTML={{ __html: openError }} />
              </div>
              <Toast.Toggle onClick={() => setOpenError("")} />
            </Toast>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
            <h3 className="text-3xl dark:text-white">Add Service</h3>
            <div className="-mx-3 mb-6 mt-4 flex flex-wrap">
              <div className="mb-6 w-full px-3 md:mb-0 md:w-1/2">
                <label
                  className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-white"
                  htmlFor="service"
                >
                  Service Name
                </label>
                <input
                  className={`block w-full appearance-none border bg-gray-200 text-gray-700 ${
                    errors.service ? "border-red-500" : ""
                  } rounded px-4 py-3 leading-tight focus:bg-white focus:outline-none`}
                  type="text"
                  placeholder="Enter name of serive"
                  {...register("service", {
                    required: true,
                  })}
                />
                {errors.service && (
                  <p className="mt-2 text-xs italic text-red-500">
                    {errors.service?.type === "required" &&
                      "Service Name is required"}
                  </p>
                )}
              </div>
              <div className="w-full px-3 md:w-1/2">
                <label
                  className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-white"
                  htmlFor="website"
                >
                  Website
                </label>
                <input
                  className={`block w-full appearance-none border bg-gray-200 text-gray-700  ${
                    errors.website ? "border-red-500" : ""
                  } rounded border-gray-200 px-4 py-3 leading-tight focus:border-gray-500 focus:bg-white focus:outline-none`}
                  type="text"
                  placeholder="Website URL"
                  {...register("website")}
                />
                {errors.website && (
                  <p className="mt-2 text-xs italic text-red-500">
                    {errors.website?.type === "required" && "Field is required"}
                  </p>
                )}
              </div>
            </div>
            <div className="-mx-3 mb-6 flex flex-wrap">
              <div className="w-full px-3">
                <label
                  className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-white"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  className={`block w-full appearance-none border bg-gray-200 text-gray-700  ${
                    errors.description ? "border-red-500" : ""
                  } rounded border-gray-200 px-4 py-3 leading-tight focus:border-gray-500 focus:bg-white focus:outline-none`}
                  placeholder="Description"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="mt-2 text-xs italic text-red-500">
                    {errors.description?.type === "required" &&
                      "Field is required"}
                  </p>
                )}
              </div>
            </div>
            <div className="-mx-3 mb-10 flex flex-wrap">
              <div className="mb-6 w-full px-3 md:mb-0 md:w-1/3">
                <label
                  className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-white"
                  htmlFor="price"
                >
                  Price
                </label>
                <input
                  className={`block w-full appearance-none border bg-gray-200 text-gray-700  ${
                    errors.description ? "border-red-500" : ""
                  } rounded border-gray-200 px-4 py-3 leading-tight focus:border-gray-500 focus:bg-white focus:outline-none`}
                  type="number"
                  placeholder="Price in USDC"
                  step="any"
                  {...register("price", { required: true })}
                />
                {errors.price && (
                  <p className="mt-2 text-xs italic text-red-500">
                    {errors.price?.type === "required" && "Price is required"}
                  </p>
                )}
              </div>
            </div>
            <Button
              type="submit"
              disabled={
                status["createWallet"] && status["createWallet"] !== "idle"
              }
            >
              Publish
            </Button>
          </form>
          {/* <UserOperation /> */}
        </div>
      </div>
    </div>
  );
}
