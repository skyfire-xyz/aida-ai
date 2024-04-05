import { parseAbi } from "viem";
import { polygonMumbai } from "viem/chains";

export const PROJECT_ID =
  process.env.NEXT_PUBLIC_PROJECT_ID || "b2d846e8-8201-4a8d-a01c-81c086532660";

export const BUNDLER_URL = `https://rpc.zerodev.app/api/v2/bundler/${PROJECT_ID}`;
export const PAYMASTER_URL = `https://rpc.zerodev.app/api/v2/paymaster/${PROJECT_ID}`;
export const PASSKEY_SERVER_URL = `https://passkeys.zerodev.app/api/v3/${PROJECT_ID}`;

export const CHAIN = polygonMumbai;
export const USDC_CONTRACT_ADDRESS =
  "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747";
export const USDC_CONTRACT_ABI = parseAbi([
  "function transfer(address recipient, uint256 amount)",
]);
export const RECEIVER_ADDRESS = "0x5C886A06B96F5Eb1f5cC62EFeE44DF4ad89b136e";

export const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3000/";
