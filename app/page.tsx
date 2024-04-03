"use client";

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
import Image from "next/image";

import { Badge, Button, Card, Kbd } from "flowbite-react";
import Sidebar from "@/src/Sidebar";
import { AiOutlineLoading } from "react-icons/ai";
import { HiMiniArrowRightOnRectangle, HiMiniUserPlus } from "react-icons/hi2";
import { HiClipboardCopy, HiExternalLink, HiOutlinePlus } from "react-icons/hi";

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

let kernelAccount: any;
let kernelClient: any;

let sessionKeyAccount: any;
let passkeyValidatorLogin: any;

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState("");
  const [step, setStep] = useState(1);
  const [account, setAccount] = useState();

  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const providePermissions = async () => {
    setIsCreatingKey(true);
    const sessionKeyValidator = await signerToSessionKeyValidator(
      publicClient,
      {
        signer: sessionKeySigner,
        validatorData: {
          paymaster: oneAddress,
          permissions: [
            {
              target: usdcContractAddress,
              // Maximum value that can be transferred.  In this case we
              // set it to zero so that no value transfer is possible.
              valueLimit: BigInt(100000000),
              // Contract abi
              abi: usdcContractABI,
              // Function name
              functionName: "transfer",
              // An array of conditions, each corresponding to an argument for
              // the function.
              args: [null, null],
            },
          ],
        },
      }
    );

    const sessionKeyAccount = await createKernelAccount(publicClient, {
      plugins: {
        sudo: passkeyValidatorLogin,
        regular: sessionKeyValidator,
      },
    });

    const serializedSessionKey = await serializeSessionKeyAccount(
      sessionKeyAccount,
      sessionPrivateKey
    );
    setSessionData("sessionKey", serializedSessionKey);
    setIsCreatingKey(false);
    setStep(3);
  };

  const createAccountAndClient = async (passkeyValidator: any) => {
    const sessionKeyValidator = await signerToSessionKeyValidator(
      publicClient,
      {
        signer: sessionKeySigner,
        validatorData: {
          paymaster: oneAddress,
          permissions: [
            {
              target: usdcContractAddress,
              // Maximum value that can be transferred.  In this case we
              // set it to zero so that no value transfer is possible.
              valueLimit: BigInt(100000000),
              // Contract abi
              abi: usdcContractABI,
              // Function name
              functionName: "transfer",
              // An array of conditions, each corresponding to an argument for
              // the function.
              args: [null, null],
            },
          ],
        },
      }
    );

    sessionKeyAccount = await createKernelAccount(publicClient, {
      plugins: {
        sudo: passkeyValidator,
        regular: sessionKeyValidator,
      },
    });

    kernelClient = createKernelAccountClient({
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

    setAccount(sessionKeyAccount);
  };

  // Function to be called when "Register" is clicked
  const handleRegister = async () => {
    setIsRegistering(true);

    const passkeyValidator = await createPasskeyValidator(publicClient, {
      passkeyName: username,
      passkeyServerUrl: PASSKEY_SERVER_URL,
    });

    await createAccountAndClient(passkeyValidator);

    setIsRegistering(false);
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);

    const passkeyValidator = await getPasskeyValidator(publicClient, {
      passkeyServerUrl: PASSKEY_SERVER_URL,
    });

    await createAccountAndClient(passkeyValidator);

    passkeyValidatorLogin = passkeyValidator;

    setIsLoggingIn(false);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <></>;

  // Spinner component for visual feedback during loading states
  const Spinner = () => (
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  if (!account?.address) {
    return (
      <main className="flex items-center justify-center min-h-screen px-4 py-24">
        <div className="w-full max-w-lg mx-auto">
          <h1 className="text-4xl font-semibold text-center mb-12">
            <Image
              src="/images/logo_white.svg"
              loading="lazy"
              alt="Supermojo"
              width="160"
              height="40"
            />
          </h1>

          <div className="flex gap-6">
            <div className="w-1/2 flex flex-col gap-2">
              <h2 className="text-white">Register</h2>
              {/* Account Address Label */}
              {account?.address && (
                <div className="text-center mb-4">
                  Email Address:{" "}
                  <a
                    href={`https://jiffyscan.xyz/account/${account?.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {" "}
                    {account?.address}{" "}
                  </a>
                </div>
              )}

              {/* Input Box */}
              <input
                type="email"
                placeholder="Email Address"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="p-2 text-black border border-gray-300 rounded-lg w-full"
              />
              {/* Register Button */}
              <Button
                onClick={handleRegister}
                disabled={isLoggingIn || isRegistering}
              >
                {isRegistering ? (
                  <AiOutlineLoading className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <HiMiniUserPlus className="h-5 w-5 mr-2" />
                )}
                Sign Up
              </Button>
            </div>
            <div className="w-1/2 flex flex-col gap-2">
              <h2 className="text-white">Do you already have account?</h2>
              {/* Login Button */}
              <Button
                onClick={handleLogin}
                disabled={isLoggingIn || isRegistering}
              >
                {isLoggingIn ? (
                  <AiOutlineLoading className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <HiMiniArrowRightOnRectangle className="h-5 w-5 mr-2" />
                )}
                Login
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  function OnboardingStep({
    title,
    description,
    step,
    active,
  }: {
    title: string;
    description: string;
    step: string;
    active: boolean;
  }) {
    if (active) {
      return (
        <li className="flex items-center text-blue-600 dark:text-blue-500 space-x-2.5 rtl:space-x-reverse">
          <span className="flex items-center justify-center w-8 h-8 border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
            {step}
          </span>
          <span>
            <h3 className="font-medium leading-tight">{title}</h3>
            <p className="text-sm">{description}</p>
          </span>
        </li>
      );
    }
    return (
      <li className="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5 rtl:space-x-reverse">
        <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
          {step}
        </span>
        <span>
          <h3 className="font-medium leading-tight">{title}</h3>
          <p className="text-sm">{description}</p>
        </span>
      </li>
    );
  }

  return (
    <div>
      <div className="flex h-full p-1">
        <Sidebar />

        <div className="shadow-lg h-full w-screen rounded-lg bg-white max-w-[none] mt-6 mb-6">
          <div className="h-full w-full rounded-lg my-10 p-20">
            <div>
              <Card>
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Onboarding
                </h5>
                <ol className="mb-4 items-center w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse">
                  <OnboardingStep
                    title="Fund your wallet with USDC"
                    description="Transfer your USDC to your wallet"
                    step="1"
                    active={step === 1}
                  />
                  <OnboardingStep
                    title="Grant permission to spend USDC"
                    description="Click button / confirm with passkey to enable user's sender wallet"
                    step="2"
                    active={step === 2}
                  />
                  <OnboardingStep
                    title="All set!"
                    description=""
                    step="3"
                    active={step === 3}
                  />
                </ol>
                {step === 2 && (
                  <div>
                    <Button
                      onClick={providePermissions}
                      disabled={isCreatingKey}
                    >
                      {isCreatingKey ? (
                        <AiOutlineLoading className="h-5 w-5 mr-2 animate-spin" />
                      ) : (
                        <HiOutlinePlus className="h-5 w-5 mr-2" />
                      )}
                      Enable Sender Wallet
                    </Button>
                    <span className="text-sm">
                      * This action gives us a permission to send USDC to
                      specific wallet
                    </span>
                  </div>
                )}
                {step === 1 && (
                  <>
                    <div className="mb-2">
                      <p className="my-2">Your Address (Polygon Mumbai)</p>
                      <div className="flex items-center">
                        <Kbd
                          className="cursor-pointer"
                          onClick={() => {
                            navigator.clipboard.writeText(account.address);
                          }}
                        >
                          {account.address}
                        </Kbd>
                        <button
                          onClick={() => {
                            window.open(
                              `https://jiffyscan.xyz/account/${account.address}`,
                              "_blank"
                            );
                          }}
                        >
                          <HiExternalLink className="ml-2 w-5 h-5" />
                        </button>
                      </div>
                      <Button className="mt-4" onClick={() => setStep(2)}>
                        Confirm
                      </Button>
                    </div>
                  </>
                )}
                {step === 3 && (
                  <div>
                    All set! Please go ahead and try out the{" "}
                    <a
                      href="https://marketplace.supermojo.one/ai"
                      target="_blank"
                    >
                      Aida.AI
                    </a>{" "}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
