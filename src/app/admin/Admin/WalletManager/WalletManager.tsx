"use client";

import axios from "axios";
import { use, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import DialogFundTransfer from "./DialogFundTransfer";
import { BACKEND_API_URL } from "@/src/common/lib/constant";
import { Button, Card, Label, Select, Toast } from "flowbite-react";
import { IoMdSend } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { HiCheck, HiExclamation, HiX } from "react-icons/hi";
import { MdLoop } from "react-icons/md";
import { IoIosWallet } from "react-icons/io";
import UserOperation from "./UserOperation";
import PaymentTransactions from "./PaymentTransactions";
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

const walletTypes = [
  // 'Minting',
  // 'Acquisition',
  // 'Funding',
  // 'Payment',
  "Sender",
  "Receiver",
  // 'Deployment',
] as const;

/**
 * @pattern ^[a-zA-Z0-9_]+$
 * @format network
 */
export type WalletType = (typeof walletTypes)[number];

export default function WalletManager() {
  const dispatch = useDispatch<AppDispatch>();
  const { status, transactions, wallets, reservedWallets } =
    useSelector(useDashboardSelector);

  const [walletType, setWalletType] = useState<WalletType>("Receiver");
  // const [wallets, setWallets] = useState([]);
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
    <div className="h-full w-full rounded-lg my-10 p-20">
      <div className="flex w-full gap-10">
        <div className="flex flex-col md:min-w-[640px] min-w-auto">
          <div className="w-full max-w-lg">
            <h3 className="text-3xl">Wallet List</h3>
          </div>
          <div className="mt-5">
            <Label htmlFor="wallet-type">Wallet Type</Label>
            <Select
              value={walletType}
              id="wallet-type"
              onChange={(e) => {
                setWalletType(e.target.value as WalletType);
              }}
            >
              {walletTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </Select>
          </div>
          <div ref={walletList} className="mt-8 overflow-scroll">
            {!wallets[walletType].length && <p>No wallets found</p>}
            {wallets[walletType].map((wallet: Wallet, index: number) => {
              const reservedWalletInfo = reservedWallets[walletType].find(
                (w) => {
                  return w.address === wallet.address;
                }
              );

              return (
                <Card
                  key={index}
                  className={`mb-4 ${
                    walletAdded
                      ? "first:bg-[rgb(229,246,253)]"
                      : "first:bg-[#ffffff]"
                  } transition-all`}
                >
                  <div>
                    <Link
                      className=" font-bold"
                      href={`https://www.oklink.com/amoy/address/${wallet.address}/token-transfer`}
                    >
                      {wallet.address}
                    </Link>
                  </div>
                  {reservedWalletInfo?.name && (
                    <div>
                      <b>Name: </b>
                      {reservedWalletInfo.name}
                    </div>
                  )}
                  <div>
                    <b>Network: </b>
                    {wallet.network}
                  </div>
                  <div>
                    <b>Created At: </b>
                    {wallet.createdAt}
                  </div>
                  <div className="flex gap-4">
                    <Button
                      size="xs"
                      className="flex items-center"
                      onClick={() => {
                        setTransferFund(wallet);
                      }}
                    >
                      <IoMdSend className="mr-2" />
                      Transfer Fund
                    </Button>
                    {!reservedWalletInfo && (
                      <Button size="xs" color="failure">
                        <MdDelete className="mr-2" />
                        Delete
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}

            <DialogFundTransfer
              transferFund={transferFund}
              onClose={() => setTransferFund(null)}
              setOpenError={setOpenError}
              setOpenSuccess={setOpenSuccess}
              setOpenInfo={setOpenInfo}
            />
          </div>
        </div>

        <div className="w-full flex flex-col">
          {!!openInfo && (
            <Toast className="fixed left-10 bottom-10 max-w-sm">
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
            <Toast className="fixed left-10 bottom-10 max-w-sm">
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
            <Toast className="fixed left-10 bottom-10 max-w-sm">
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
            <h3 className="text-3xl">Create a wallet</h3>
            <div className="flex flex-wrap -mx-3 mb-6 mt-4">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="service"
                >
                  Service Name
                </label>
                <input
                  className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                    errors.service ? "border-red-500" : ""
                  } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`}
                  type="text"
                  placeholder="Enter name of serive"
                  {...register("service", {
                    required: true,
                  })}
                />
                {errors.service && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.service?.type === "required" &&
                      "Service Name is required"}
                  </p>
                )}
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="website"
                >
                  Website
                </label>
                <input
                  className={`appearance-none block w-full bg-gray-200 text-gray-700 border  ${
                    errors.website ? "border-red-500" : ""
                  } border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                  type="text"
                  placeholder="Website URL"
                  {...register("website")}
                />
                {errors.website && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.website?.type === "required" && "Field is required"}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  className={`appearance-none block w-full bg-gray-200 text-gray-700 border  ${
                    errors.description ? "border-red-500" : ""
                  } border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                  placeholder="Description"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.description?.type === "required" &&
                      "Field is required"}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-10">
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="price"
                >
                  Price
                </label>
                <input
                  className={`appearance-none block w-full bg-gray-200 text-gray-700 border  ${
                    errors.description ? "border-red-500" : ""
                  } border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                  type="number"
                  placeholder="Price in USDC"
                  step="any"
                  {...register("price", { required: true })}
                />
                {errors.price && (
                  <p className="text-red-500 text-xs italic mt-2">
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
      <PaymentTransactions />
    </div>
  );
}
