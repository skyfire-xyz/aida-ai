"use client";

import axios from "axios";
import { use, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import DialogFundTransfer from "./DialogFundTransfer";
import { BACKEND_API_URL } from "@/src/common/lib/constant";
import { Button, Card, Label, Select, Table, Toast } from "flowbite-react";
import { IoMdSend } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { HiCheck, HiExclamation, HiX } from "react-icons/hi";
import { MdLoop } from "react-icons/md";
import { IoIosWallet } from "react-icons/io";
import UserOperation from "../../admin/components/UserOperation";
import PaymentTransactions from "../../transactions/components/PaymentTransactions";
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
        <div className="min-w-auto flex flex-col">
          <div className="w-full max-w-lg">
            <h3 className="text-3xl dark:text-white">Wallet List</h3>
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
            {wallets[walletType].length > 0 && (
              <Table>
                <Table.Head>
                  <Table.HeadCell>Address</Table.HeadCell>
                  <Table.HeadCell>Service</Table.HeadCell>
                  <Table.HeadCell>Network</Table.HeadCell>
                  <Table.HeadCell>Created At</Table.HeadCell>
                  <Table.HeadCell>
                    <span className="sr-only">Action</span>
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {wallets[walletType].map((wallet: Wallet, index: number) => {
                    const reservedWalletInfo = reservedWallets[walletType].find(
                      (w) => {
                        return w.address === wallet.address;
                      },
                    );

                    return (
                      <Table.Row
                        key={index}
                        className={`bg-white dark:border-gray-700 dark:bg-gray-800 ${
                          walletAdded
                            ? "first:bg-[rgb(229,246,253)]"
                            : "first:bg-[#ffffff]"
                        }`}
                      >
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          <Link
                            className="font-bold"
                            href={`https://www.oklink.com/amoy/address/${wallet.address}/token-transfer`}
                          >
                            {wallet.address}
                          </Link>
                        </Table.Cell>
                        <Table.Cell>
                          {reservedWalletInfo?.name && (
                            <div>{reservedWalletInfo.name}</div>
                          )}
                        </Table.Cell>
                        <Table.Cell>{wallet.network}</Table.Cell>
                        <Table.Cell>{wallet.createdAt}</Table.Cell>
                        <Table.Cell>
                          <div className="flex gap-2">
                            <Button
                              size="xs"
                              className="flex items-center whitespace-nowrap"
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
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            )}

            <DialogFundTransfer
              transferFund={transferFund}
              onClose={() => setTransferFund(null)}
              setOpenError={setOpenError}
              setOpenSuccess={setOpenSuccess}
              setOpenInfo={setOpenInfo}
            />
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
        </div>
      </div>
    </div>
  );
}
