import {
  ENABLE_LOCAL_API_KEY,
  SKYFIRE_API_KEY,
  SKYFIRE_ENV,
} from "@/src/config/envs";
import { SkyfireClient } from "@skyfire-xyz/skyfire-sdk";
import { ApiError } from "@/src/types/api";

function getClient(apiKey: string) {
  return new SkyfireClient({
    environment: SKYFIRE_ENV,
    apiKey: apiKey,
  });
}

export async function POST(request: Request) {
  const req = await request.json();

  // Allowing to override the default API key from client side if ENABLE_LOCAL_API_KEY is set
  let API_KEY = ENABLE_LOCAL_API_KEY
    ? request.headers.get("local-skyfire-api-key") || SKYFIRE_API_KEY
    : SKYFIRE_API_KEY;

  const client = getClient(API_KEY);

  let res;
  try {
    switch (req.chatType) {
      case "chat":
        res = await client.proxies.chatGpt(req.data);
        break;
      case "meme":
        res = await client.proxies.joke(req.data);
        break;
      case "image_generation":
        res = await client.proxies.image(req.data);
        break;
      case "video_search":
        res = await client.proxies.video(req.data);
        break;
      case "web_search":
        res = await client.proxies.websearch(req.data);
        break;
      case "tasklist":
        res = await client.proxies.tasklist(req.data);
        break;
      case "dataset_search":
        res = await client.proxies.searchDataset(req.data);
        break;
      case "text_completion":
        res = await client.proxies.chatPerplexity(req.data);
        break;
      case "random_joke":
        res = await client.proxies.joke(req.data);
        break;
      case "dataset_analyze":
        res = await client.proxies.analyzeDataset(req.data);
        break;
      case "dataset/download":
        res = await client.proxies.downloadDataset(req.data);
        break;
      default:
        break;
    }
  } catch (err) {
    if (err instanceof Error) {
      const error = err as ApiError;
      return Response.json(
        { message: error.body.message },
        { status: error.status },
      );
    }

    return Response.json(
      { message: "Unexpected Server Error" },
      { status: 500 },
    );
  }

  if (!res)
    return Response.json(
      { message: "Unexpected Server Error" },
      { status: 500 },
    );

  return Response.json(res);
}
