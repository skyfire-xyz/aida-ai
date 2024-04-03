"use client";

import Image from "next/image";

import Link from "next/link";

import {
  createKernelAccount,
  createKernelAccountClient,
  createZeroDevPaymasterClient,
} from "@zerodev/sdk";
import {
  createPasskeyValidator,
  getPasskeyValidator,
} from "@zerodev/passkey-validator";
import {
  signerToSessionKeyValidator,
  serializeSessionKeyAccount,
  deserializeSessionKeyAccount,
  oneAddress,
} from "@zerodev/session-key";

import { bundlerActions } from "permissionless";
import React, { useEffect, useState } from "react";
import { createPublicClient, http, parseAbi, encodeFunctionData } from "viem";
import { polygonMumbai, sepolia } from "viem/chains";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import Sidebar from "@/src/Sidebar";
import { Alert, Button, Kbd } from "flowbite-react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiExternalLink, HiOutlineCurrencyDollar } from "react-icons/hi";

export const setSessionData = async (key: string, data: string) => {
  if (key) {
    window["localStorage"].setItem(key, data);
  } else {
    setSessionData(key, data);
  }
};

export const getSessionData = (key: string): any => {
  const storageData = window["localStorage"].getItem(key) || "";
  return storageData;
};

// POLYGON
const BUNDLER_URL =
  "https://rpc.zerodev.app/api/v2/bundler/b2d846e8-8201-4a8d-a01c-81c086532660";
const PAYMASTER_URL =
  "https://rpc.zerodev.app/api/v2/paymaster/b2d846e8-8201-4a8d-a01c-81c086532660";
const PASSKEY_SERVER_URL =
  "https://passkeys.zerodev.app/api/v3/b2d846e8-8201-4a8d-a01c-81c086532660";

const sr =
  "eyJzZXNzaW9uS2V5UGFyYW1zIjp7InBheW1hc3RlciI6IjB4MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMSIsInBlcm1pc3Npb25zIjpbeyJ0YXJnZXQiOiIweGU2YjhhNUNGODU0NzkxNDEyYzFmNkVGQzdDQWY2MjlmNURmMWM3NDciLCJ2YWx1ZUxpbWl0IjoiMTAwMDAwMDAwIiwiYWJpIjpbeyJuYW1lIjoidHJhbnNmZXIiLCJ0eXBlIjoiZnVuY3Rpb24iLCJzdGF0ZU11dGFiaWxpdHkiOiJub25wYXlhYmxlIiwiaW5wdXRzIjpbeyJ0eXBlIjoiYWRkcmVzcyIsIm5hbWUiOiJyZWNpcGllbnQifSx7InR5cGUiOiJ1aW50MjU2IiwibmFtZSI6ImFtb3VudCJ9XSwib3V0cHV0cyI6W119XSwiZnVuY3Rpb25OYW1lIjoidHJhbnNmZXIiLCJhcmdzIjpbbnVsbCxudWxsXSwic2lnIjoiMHhhOTA1OWNiYiIsInJ1bGVzIjpbXSwiaW5kZXgiOjAsImV4ZWN1dGlvblJ1bGUiOnsidmFsaWRBZnRlciI6MCwiaW50ZXJ2YWwiOjAsInJ1bnMiOjB9LCJvcGVyYXRpb24iOjB9XSwidmFsaWRBZnRlciI6MCwidmFsaWRVbnRpbCI6MH0sImV4ZWN1dG9yRGF0YSI6eyJleGVjdXRvciI6IjB4MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCIsInNlbGVjdG9yIjoiMHg1MTk0NTQ0NyJ9LCJ2YWxpZGl0eURhdGEiOnsidmFsaWRBZnRlciI6MCwidmFsaWRVbnRpbCI6MH0sImFjY291bnRQYXJhbXMiOnsiaW5pdENvZGUiOiIweDVkZTQ4MzlhNzZjZjU1ZDBjOTBlMjA2MWVmNDM4NmQ5NjJFMTVhZTMyOTY2MDFjZDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMGQzMDgyODcyZjhiMDYwNzNhMDIxYjQ2MDJlMDIyZDVhMDcwZDdjZmMwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDYwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwZTRkMWY1Nzg5NDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDNhMDk4MGQ0OTdmOTA4ZmU1ZWFhNTUwNWFmODVjMTA5MTFhNzE4ZmQwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDQwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA4MGY0MDI5NGU3MGQyNmU4MWNlMTc5Y2NhNzMwZjc0YjE3YjAyMWRmNWJkMGMyNmI3MDlmNzJjYzQ2Y2MwNjkxMzJkYmUxZTZmMDFkMjE4ZTdlOWFlNTE0OWRjYWNlOWNkNTFkMzI1NTdhOTZmNTk5ZjQ5MTMwMDlhMGY2MzA5ZDg4MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMTI1M2QwYTg3N2JiZWU4MzYyZDQyNTZlNjU5MzkwNGUzNTA0MDI4MjQ5MmE2ZDdkZjVkMzNhZTljYzJiMjFjY2YwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCIsImFjY291bnRBZGRyZXNzIjoiMHg5YjliQzVkYmUwZTZGY0Y4NmJkQTk2M0JCMjQ3NEFmZjRjMzJGNEQzIn0sImVuYWJsZVNpZ25hdHVyZSI6IjB4MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDBhMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAxMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAxNWI0MDc4MWM5ZGNkM2I3NjU1N2QzOWRiNDYwMzZkNGYzNzAyOWEzYmY2YzBiYzNkZDQ2NmMyYjgyZWM1YjVmZTU5ZTM1NDFkYmU3MjQxMGI1MDlkNWYyZjBhNjc0YzkzOTc2OGU0ZDRhNDUzZDJhNjI3MTU5ZjBmZjEyOWIyOTEwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDI1NDk5NjBkZTU4ODBlOGM2ODc0MzQxNzBmNjQ3NjYwNWI4ZmU0YWViOWEyODYzMmM3OTk1Y2YzYmE4MzFkOTc2MzA1MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDg2N2IyMjc0Nzk3MDY1MjIzYTIyNzc2NTYyNjE3NTc0Njg2ZTJlNjc2NTc0MjIyYzIyNjM2ODYxNmM2YzY1NmU2NzY1MjIzYTIyNmMzNzQxNzE0OTVhNGYzMDY4NDQ0NTU1NzQ2ZDZhNmYzODRkNDk2NzY2NmI3MDYxNzg0NTY0NmQ2YzQ3NmQ0NzQxMzY3MjVmNGM1NTczNDE2MjZhMzAyMjJjMjI2ZjcyNjk2NzY5NmUyMjNhMjI2ODc0NzQ3MDNhMmYyZjZjNmY2MzYxNmM2ODZmNzM3NDNhMzMzMDMwMzAyMjJjMjI2MzcyNmY3MzczNGY3MjY5Njc2OTZlMjIzYTY2NjE2YzczNjU3ZDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAiLCJwcml2YXRlS2V5IjoiMHhhYWRmMTZjNDUyZDJiYjcwZDIxODU5NTk3ODg4ZjY5ZjhkNGQyZDQzODE5MDQ5ODNhMTBmZGM0ZWY5ODU2M2E0In0=";

const CHAIN = polygonMumbai;

const usdcContractAddress = "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747";
const usdcContractABI = parseAbi([
  "function transfer(address recipient, uint256 amount)",
]);

const sessionPrivateKey = generatePrivateKey();
const sessionKeySigner = privateKeyToAccount(sessionPrivateKey);

const publicClient = createPublicClient({
  transport: http(BUNDLER_URL),
});

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [sessionKeyAccount, setSessionKeyAccount] = useState<any>();
  const [isSpending, setIsSpending] = useState(false);
  const [username, setUsername] = useState("");
  const [account, setAccount] = useState("");

  const [accountAddress, setAccountAddress] = useState("");
  const [isKernelClientReady, setIsKernelClientReady] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSendingUserOp, setIsSendingUserOp] = useState(false);
  const [userOpHash, setUserOpHash] = useState("");
  const [userOpStatus, setUserOpStatus] = useState("");

  // Function to be called when "Login" is clicked
  const handleSendUserOp = async () => {
    setIsSendingUserOp(true);
    setIsSpending(true);

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

    const userOpHash = await kernelClient.sendUserOperation({
      userOperation: {
        callData: await sessionKeyAccount.encodeCallData({
          to: usdcContractAddress,
          value: BigInt(0),
          data: encodeFunctionData({
            abi: usdcContractABI,
            functionName: "transfer",
            args: ["0x5C886A06B96F5Eb1f5cC62EFeE44DF4ad89b136e", BigInt(10000)],
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

  console.log(userOpHash, "userOpHash");
  console.log(userOpStatus, "userOpStatus");

  return (
    <div className="flex h-full p-1">
      <Sidebar />

      <div className="shadow-lg h-full w-screen rounded-lg bg-white max-w-[none] mt-6 mb-6">
        <div className="h-full w-full rounded-lg my-10 p-20">
          {sessionKeyAccount && (
            <div>
              <h5 className="font-bold text-lg">User Wallet</h5>
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
