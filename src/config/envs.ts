export const SKYFIRE_API_KEY = process.env.SKYFIRE_API_KEY || "";

export const ENABLE_LOCAL_API_KEY =
  process.env.NEXT_PUBLIC_ENABLE_LOCAL_API_KEY || false;

export const SKYFIRE_ENV =
  (process.env.SKYFIRE_ENV as ENV_TYPES) || "production";
