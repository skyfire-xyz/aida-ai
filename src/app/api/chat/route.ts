import { SKYFIRE_API_KEY } from "@/src/lib/constant";
import { SkyfireClient } from "@skyfire-xyz/skyfire-sdk";

const client = new SkyfireClient({
  environment: "development",
  apiKey: SKYFIRE_API_KEY,
});

export async function POST(request: Request) {
  const req = await request.json();
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
      case "dataset/analyze":
        res = await client.proxies.analyzeDataset(req.data);
        break;
      case "dataset/download":
        res = await client.proxies.downloadDataset(req.data);
        break;
      default:
        break;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }

  if (!res) return Response.json({ error: "Invalid API" });

  return Response.json(res);
}
