"use client";

import axios from "axios";
import { use, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import DialogFundTransfer from "./DialogFundTransfer";
import { BACKEND_API_URL } from "@/src/common/lib/constant";
import {
  Breadcrumb,
  Button,
  Card,
  Label,
  Select,
  Table,
  Toast,
} from "flowbite-react";
import { IoMdSend } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { HiCheck, HiExclamation, HiX } from "react-icons/hi";
import { MdLoop } from "react-icons/md";
import { IoIosWallet } from "react-icons/io";
import PaymentTransactions from "../../transactions/components/AllTransactions";
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
import { useRouter } from "next/navigation";
import { FiDownload, FiUpload } from "react-icons/fi";
import { HiHome } from "react-icons/hi2";
import Notification from "@/src/app/components/Notification";

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
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { status, transactions, wallets, reservedWallets } =
    useSelector(useDashboardSelector);

  const [walletType, setWalletType] = useState<WalletType>("Sender");
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
    getWallets();
  }, [walletType]);

  return (
    <div className="h-full w-full rounded-lg">
      <div className="flex w-full gap-10">
        <div className="min-w-auto flex flex-col">
          <div className="mt-4 w-full max-w-lg">
            <h3 className="text-3xl dark:text-white">Wallets</h3>
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
            {!wallets[walletType].length && (
              <p className="dark:text-white">No wallets found</p>
            )}
            {wallets[walletType].length > 0 && (
              <Table>
                <Table.Head>
                  <Table.HeadCell>Address</Table.HeadCell>
                  <Table.HeadCell>Service</Table.HeadCell>
                  <Table.HeadCell>Balance</Table.HeadCell>
                  <Table.HeadCell>Network</Table.HeadCell>
                  <Table.HeadCell>Created At</Table.HeadCell>
                  <Table.HeadCell>
                    <span className="sr-only">Action</span>
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {wallets[walletType].map((wallet: Wallet, index: number) => {
                    const reservedWalletInfo = reservedWallets[walletType].find(
                      (w: Wallet) => {
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
                        <Table.Cell>$ xx.xx</Table.Cell>
                        <Table.Cell>{wallet.network}</Table.Cell>
                        <Table.Cell>{wallet.createdAt}</Table.Cell>
                        <Table.Cell>
                          <div className="flex gap-2">
                            <Button
                              size="xs"
                              className="flex items-center whitespace-nowrap"
                              onClick={() => {
                                router.push(
                                  `/dashboard/wallets/fund/${wallet.address}`,
                                );
                              }}
                            >
                              <FiDownload className="mr-2" />
                              Fund
                            </Button>
                            <Button
                              size="xs"
                              className="flex items-center whitespace-nowrap"
                              disabled
                              onClick={() => {
                                // router.push(
                                //   `/dashboard/wallets/fund/${wallet.address}`,
                                // );
                              }}
                            >
                              <FiUpload className="mr-2" />
                              Widthdraw
                            </Button>
                            <Button
                              size="xs"
                              className="flex items-center whitespace-nowrap"
                              onClick={() => {
                                setTransferFund(wallet);
                              }}
                            >
                              <IoMdSend className="mr-2" />
                              Transfer
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
              transferFundObj={transferFund}
              onClose={() => setTransferFund(null)}
            />
          </div>
        </div>

        <div className="flex w-full flex-col">
          <Notification
            asyncActionKey="transferFund"
            selector={useDashboardSelector}
            resetStatus={resetStatus}
            messages={{
              success:
                "Successfully requested fund transfer. <br />Your fund will be transferred in a few minutes.",
              error: "",
              pending: "Sorry, something went wrong. Please try again.",
            }}
          />
        </div>
      </div>
    </div>
  );
}
