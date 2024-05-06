import { parseAbi } from "viem";
import { polygonAmoy } from "viem/chains";

export const PROJECT_ID =
  process.env.NEXT_PUBLIC_PROJECT_ID || "0cfea5a1-ee87-4e1b-aaeb-58201716d4eb";

export const BUNDLER_URL = `https://rpc.zerodev.app/api/v2/bundler/${PROJECT_ID}`;
export const PAYMASTER_URL = `https://rpc.zerodev.app/api/v2/paymaster/${PROJECT_ID}`;
export const PASSKEY_SERVER_URL = `https://passkeys.zerodev.app/api/v3/${PROJECT_ID}`;

export const CHAIN = polygonAmoy;
export const USDC_CONTRACT_ADDRESS =
  "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582"; // TODO: Contract not verified
export const USDC_CONTRACT_ABI = parseAbi([
  "function transfer(address recipient, uint256 amount)",
]);
export const RECEIVER_ADDRESS = "0x5C886A06B96F5Eb1f5cC62EFeE44DF4ad89b136e";

export const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3000/";

export const AIDA_USER_ID =
  process.env.NEXT_PUBLIC_AIDA_USER_ID ||
  "ebc00bf9-5fe3-4f2d-a34d-2c41882c9a79";
