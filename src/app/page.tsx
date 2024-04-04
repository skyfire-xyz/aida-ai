"use client";

import { createKernelAccount } from "@zerodev/sdk";
import {
  createPasskeyValidator,
  getPasskeyValidator,
} from "@zerodev/passkey-validator";
import {
  signerToSessionKeyValidator,
  serializeSessionKeyAccount,
  oneAddress,
} from "@zerodev/session-key";

import React, { useEffect, useState } from "react";
import { createPublicClient, http } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import Image from "next/image";

import { Button, Card, Kbd } from "flowbite-react";
import Sidebar from "@/src/common/components/Sidebar";
import { AiOutlineLoading } from "react-icons/ai";
import { HiMiniArrowRightOnRectangle, HiMiniUserPlus } from "react-icons/hi2";
import { HiExternalLink, HiOutlinePlus } from "react-icons/hi";
import {
  BUNDLER_URL,
  PASSKEY_SERVER_URL,
  USDC_CONTRACT_ADDRESS,
  USDC_CONTRACT_ABI,
} from "@/src/common/lib/constant";
import { setSessionData } from "@/src/common/lib/utils";
import OnboardingStep from "./components/OnboardingStep";

const publicClient = createPublicClient({
  transport: http(BUNDLER_URL),
});

let passkeyValidator: any;

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState("");
  const [step, setStep] = useState(1);
  const [accountAddress, setAccountAddress] = useState("");

  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <></>;

  /**
   * Create a session key that allows us to transfer USDC from this wallet
   * https://docs.zerodev.app/sdk/plugins/session-keys
   */
  const createSessionKey = async () => {
    setIsCreatingKey(true);

    const sessionPrivateKey = generatePrivateKey(); // Not sure why this needs to be generated for this steps
    const sessionKeySigner = privateKeyToAccount(sessionPrivateKey);
    const sessionKeyValidator = await signerToSessionKeyValidator(
      publicClient,
      {
        signer: sessionKeySigner,
        validatorData: {
          paymaster: oneAddress,
          permissions: [
            {
              target: USDC_CONTRACT_ADDRESS,
              valueLimit: BigInt(100000000),
              abi: USDC_CONTRACT_ABI,
              functionName: "transfer",
              args: [null, null],
            },
          ],
        },
      }
    );

    // Create a Kernel Account with the session key validator
    const sessionKeyAccount = await createKernelAccount(publicClient, {
      plugins: {
        sudo: passkeyValidator,
        regular: sessionKeyValidator,
      },
    });

    // Serialize the session key and save it to the local storage for future use
    const serializedSessionKey = await serializeSessionKeyAccount(
      sessionKeyAccount,
      sessionPrivateKey
    );
    setSessionData("sessionKey", serializedSessionKey);

    setIsCreatingKey(false);
    setStep(3);
  };

  const createAccount = async (passkeyValidator: any) => {
    const kernelAccount = await createKernelAccount(publicClient, {
      plugins: {
        sudo: passkeyValidator,
      },
    });
    setAccountAddress(kernelAccount.address);
  };

  const handleRegister = async () => {
    setIsRegistering(true);

    passkeyValidator = await createPasskeyValidator(publicClient, {
      passkeyName: username,
      passkeyServerUrl: PASSKEY_SERVER_URL,
    });
    await createAccount(passkeyValidator);

    setIsRegistering(false);
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);

    passkeyValidator = await getPasskeyValidator(publicClient, {
      passkeyServerUrl: PASSKEY_SERVER_URL,
    });
    await createAccount(passkeyValidator);

    setIsLoggingIn(false);
  };

  // Sign Up
  if (!accountAddress) {
    return (
      <main className="flex items-center justify-center min-h-screen px-4 py-24">
        <div className="w-full max-w-xl mx-auto">
          <h2 className="text-4xl font-semibold text-center mb-12">
            <Image
              src="/images/logo_white.svg"
              loading="lazy"
              alt="Supermojo"
              width="160"
              height="40"
            />
          </h2>

          <div className="flex gap-6">
            <div className="w-1/2 flex flex-col gap-2">
              <h2 className="text-white">Register</h2>
              {/* Input Box */}
              <input
                type="text"
                placeholder="Username"
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

  // Logged in
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
                    <Button onClick={createSessionKey} disabled={isCreatingKey}>
                      {isCreatingKey ? (
                        <AiOutlineLoading className="h-5 w-5 mr-2 animate-spin" />
                      ) : (
                        <HiOutlinePlus className="h-5 w-5 mr-2" />
                      )}
                      Create a session key
                    </Button>
                    <span className="text-sm">
                      * This action gives us a permission to transfer USDC
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
                            navigator.clipboard.writeText(accountAddress);
                          }}
                        >
                          {accountAddress}
                        </Kbd>
                        <button
                          onClick={() => {
                            window.open(
                              `https://jiffyscan.xyz/account/${accountAddress}`,
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
