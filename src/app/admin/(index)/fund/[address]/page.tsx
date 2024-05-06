"use client";

import {
  http,
  createWalletClient,
  encodeFunctionData,
  custom,
  parseEther,
} from "viem";
import { polygonAmoy } from "viem/chains";
import {
  Breadcrumb,
  Button,
  Card,
  Modal,
  Progress,
  Tabs,
  TextInput,
} from "flowbite-react";
import QRCode from "react-qr-code";
import { usePathname } from "next/navigation";
import { AiFillBank } from "react-icons/ai";
import { BsCreditCard2Back } from "react-icons/bs";
import { GrBitcoin } from "react-icons/gr";
import { BiTransferAlt } from "react-icons/bi";
import Image from "next/image";
import { defaultImageLoader } from "@/src/common/lib/imageLoaders";
import { IoLogoUsd } from "react-icons/io";
import { useEffect, useState } from "react";
import { HiHome } from "react-icons/hi2";
import {
  USDC_CONTRACT_ABI,
  USDC_CONTRACT_ADDRESS,
} from "@/src/common/lib/constant";

export default function Wallets(props: { params: { address: `0x${string}` } }) {
  const address: `0x${string}` = props.params.address;
  const [usdc, setUsdc] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  // Viem
  async function connectWallet() {
    const [account] = await window.ethereum?.request({
      method: "eth_requestAccounts",
    });

    const walletClient = createWalletClient({
      chain: polygonAmoy,
      transport: custom(window.ethereum!),
    });

    try {
      const hash = await walletClient.sendTransaction({
        account: account,
        to: USDC_CONTRACT_ADDRESS,
        value: parseEther(""),
        data: encodeFunctionData({
          abi: USDC_CONTRACT_ABI,
          functionName: "transfer",
          args: [address, BigInt(usdc * 1000000)],
        }),
      });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div>
      <Breadcrumb aria-label="Default breadcrumb example">
        <Breadcrumb.Item href="/dashboard" icon={HiHome}>
          Dashboard
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/dashboard/wallets">
          Fund & Withdraw
        </Breadcrumb.Item>
        <Breadcrumb.Item>Fund Wallet - [{address}]</Breadcrumb.Item>
      </Breadcrumb>
      <div className="mt-20 w-full max-w-lg">
        <h3 className="mb-4 text-3xl dark:text-white">Fund Wallet</h3>
      </div>
      <Card className={`mb-4 max-w-md transition-all dark:text-white`}>
        <h3 className="text-sm">Payment method</h3>

        <Tabs aria-label="Default tabs" style="default">
          <Tabs.Item active title="Bank" icon={AiFillBank}>
            <div className="mt-6">
              <h3 className="mb-2 text-sm">Amount</h3>
              <span className="mb-1 flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <AiFillBank /> Daily Limit
                </div>
                <div>$8,642 remaining</div>
              </span>
              <Progress size={"sm"} progress={12} />
            </div>

            <div className="mt-6 flex items-center justify-between gap-2">
              <TextInput
                id="USD"
                step=".01"
                type="number"
                placeholder="USD"
                icon={IoLogoUsd}
                onChange={(e: any) => {
                  const num: number = Number(e.target.value);
                  setUsdc(Number(Math.round(num * 0.999)));
                }}
              />
              <BiTransferAlt className="h-4 w-4" />
              <TextInput
                type="number"
                step=".01"
                icon={() => (
                  <Image
                    alt="usdc"
                    width="20"
                    height="20"
                    src="/images/usdc.svg"
                  />
                )}
                disabled
                value={usdc === 0 ? "" : usdc}
                id="usdc"
                placeholder="USDC"
              />
            </div>

            <Button
              disabled={!usdc}
              className="mt-10 w-full"
              onClick={() => setOpenModal(true)}
            >
              <span>BUY - {usdc ? usdc : ""}</span>
              <Image
                alt="usdc"
                width="20"
                height="20"
                src="/images/usdc.svg"
                className="ml-2 mr-1"
              />
              <span>USDC</span>
            </Button>
          </Tabs.Item>
          <Tabs.Item
            title="USDC"
            icon={() => (
              <Image
                className="mr-2"
                alt="usdc"
                width="20"
                height="20"
                src="/images/usdc.svg"
              />
            )}
          >
            <Card className="mt-6 p-2">
              <Tabs aria-label="Pills" style="pills">
                <Tabs.Item active title="Use QR Code">
                  <p className="pb-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="mb-1 flex items-center justify-between text-sm">
                      To finish this deposit, please go to your destination
                      wallet and complete the prompts there. Copy your USDC
                      wallet address to your external wallet
                    </span>
                  </p>

                  <div className="flex flex-col items-center justify-center gap-4">
                    <span>Scan QR code or share the address</span>
                    <div className="w-[160px] rounded bg-white p-4">
                      <QRCode
                        className="rounded"
                        size={200}
                        style={{
                          height: "auto",
                          maxWidth: "100%",
                          width: "100%",
                        }}
                        value={address}
                        viewBox={`0 0 256 256`}
                      />
                    </div>

                    <div className="text-center">
                      Wallet Address
                      <p className="text-sm">{address}</p>
                    </div>
                  </div>
                </Tabs.Item>
                <Tabs.Item title="Use Wallet">
                  <p className="pb-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="mb-1 flex items-center justify-between text-sm">
                      To finish this deposit, please enter the amount you want
                      to transfer and click send button.
                    </span>
                  </p>
                  <div className="mt-6">
                    <h3 className="text-bold mt-10 text-sm">Amount</h3>
                    <div className="mb-2 flex w-full items-center justify-between gap-2">
                      <TextInput
                        className="w-full"
                        id="USD"
                        step=".01"
                        type="number"
                        placeholder="USD"
                        icon={() => (
                          <Image
                            alt="usdc"
                            width="20"
                            height="20"
                            src="/images/usdc.svg"
                          />
                        )}
                        onChange={(e: any) => {
                          const num = Number(e.target.value).toFixed(2);
                          setUsdc(Number(num));
                        }}
                      />
                    </div>
                    <div className="text-center text-sm">
                      To
                      <p className="mt-2 text-xs">{address}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <Button
                      disabled={!usdc}
                      className="mt-4 w-full"
                      onClick={() => connectWallet()}
                    >
                      <span>Send</span>
                    </Button>
                  </p>
                </Tabs.Item>
              </Tabs>
            </Card>
          </Tabs.Item>
          <Tabs.Item
            title="Credit Card"
            icon={BsCreditCard2Back}
            disabled
          ></Tabs.Item>
        </Tabs>
      </Card>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Complete Payment</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpenModal(false)}>Confirm</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
