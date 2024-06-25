import { Receiver } from "../receivers/type";
import geminiVideoSearch from "../receivers/gemini-video-search";
import geminiWebSearch from "../receivers/gemini-websearch";
import imageGeneration from "../receivers/chatgpt-image-generation";
import humorAPIRandomJoke from "../receivers/humorapi-joke";
import chatGPTTasklist from "../receivers/chatgpt-tasklist";
import humorAPIMeme from "../receivers/humorapi-meme";
import kaggleDatasetSearch from "../receivers/kaggle-dataset-search";

export const receivers: Receiver[] = [
  kaggleDatasetSearch,
  humorAPIMeme,
  chatGPTTasklist,
  humorAPIRandomJoke,
  imageGeneration,
  geminiVideoSearch,
  geminiWebSearch,
];
