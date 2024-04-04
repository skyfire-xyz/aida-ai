"use client";

import {
  createKernelAccountClient,
  createZeroDevPaymasterClient,
} from "@zerodev/sdk";
import { deserializeSessionKeyAccount } from "@zerodev/session-key";

import { bundlerActions } from "permissionless";
import React, { useEffect, useState } from "react";
import { createPublicClient, http, encodeFunctionData } from "viem";
import Sidebar from "@/src/common/components/Sidebar";
import { Alert, Button, Kbd } from "flowbite-react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiExternalLink, HiOutlineCurrencyDollar } from "react-icons/hi";
import {
  BUNDLER_URL,
  CHAIN,
  PAYMASTER_URL,
  RECEIVER_ADDRESS,
  USDC_CONTRACT_ABI,
  USDC_CONTRACT_ADDRESS,
} from "@/src/common/lib/constant";
import { getSessionData } from "@/src/common/lib/utils";

const publicClient = createPublicClient({
  transport: http(BUNDLER_URL),
});

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [sessionKeyAccount, setSessionKeyAccount] = useState<any>();
  const [isSpending, setIsSpending] = useState(false);
  const [userOpHash, setUserOpHash] = useState("");
  const [userOpStatus, setUserOpStatus] = useState("");

  // Function to be called when "Login" is clicked
  const handleSendUserOp = async () => {
    setIsSpending(true);

    // Create a Kernel Account Client with the session key stored
    const kernelClient = createKernelAccountClient({
      account: sessionKeyAccount,
      chain: CHAIN,
      transport: http(BUNDLER_URL),
      sponsorUserOperation: async ({ userOperation }) => {
        const zerodevPaymaster = createZeroDevPaymasterClient({
          chain: CHAIN,
          transport: http(PAYMASTER_URL),
        });
        return zerodevPaymaster.sponsorUserOperation({
          userOperation,
        });
      },
    });

    // Send a UserOp to transfer USDC
    const userOpHash = await kernelClient.sendUserOperation({
      userOperation: {
        callData: await sessionKeyAccount.encodeCallData({
          to: USDC_CONTRACT_ADDRESS,
          value: BigInt(0),
          data: encodeFunctionData({
            abi: USDC_CONTRACT_ABI,
            functionName: "transfer",
            args: [RECEIVER_ADDRESS, BigInt(10000)],
          }),
        }),
      },
    });

    setUserOpHash(userOpHash);

    const bundlerClient = kernelClient.extend(bundlerActions);
    await bundlerClient.waitForUserOperationReceipt({
      hash: userOpHash,
    });

    // Update the message based on the count of UserOps
    const userOpMessage = `UserOp completed. <a href="https://jiffyscan.xyz/userOpHash/${userOpHash}?network=mumbai" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-700">Click here to view.</a>`;

    setUserOpStatus(userOpMessage);
    setIsSpending(false);
  };

  useEffect(() => {
    const init = async () => {
      const key = getSessionData("sessionKey");
      const deserializedSessionAccount = await deserializeSessionKeyAccount(
        publicClient,
        key
      );
      setSessionKeyAccount(deserializedSessionAccount);
    };
    init();
    setMounted(true);
  }, []);

  if (!mounted) return <></>;

  return (
    <div className="flex h-full p-1">
      <Sidebar />

      <div className="shadow-lg h-full w-screen rounded-lg bg-white max-w-[none] mt-6 mb-6">
        <div className="h-full w-full rounded-lg my-10 p-20">
          {sessionKeyAccount && (
            <div>
              <h5 className="font-bold text-lg">Session Key Found</h5>
              <div className="text-sm">{JSON.stringify(sessionKeyAccount)}</div>
              <div className="flex items-center mt-5">
                <Kbd
                  className="cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(sessionKeyAccount.address);
                  }}
                >
                  {sessionKeyAccount.address}
                </Kbd>
                <button
                  onClick={() => {
                    window.open(
                      `https://jiffyscan.xyz/account/${sessionKeyAccount.address}`,
                      "_blank"
                    );
                  }}
                >
                  <HiExternalLink className="ml-2 w-5 h-5" />
                </button>
              </div>
              <div className="mt-2">
                <Button onClick={handleSendUserOp} disabled={isSpending}>
                  {isSpending ? (
                    <AiOutlineLoading className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <HiOutlineCurrencyDollar className="h-5 w-5 mr-2" />
                  )}
                  Spend USDC from this wallet
                </Button>
                {userOpHash && (
                  <Alert
                    className="mt-2"
                    color={`${userOpStatus ? "success" : "info"}`}
                  >
                    UserOp {userOpStatus ? "completed." : "pending."}
                    <a
                      href={`https://jiffyscan.xyz/userOpHash/${userOpHash}?network=mumbai`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Click here to view.
                    </a>
                  </Alert>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
