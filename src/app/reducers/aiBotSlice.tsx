import axios from "axios";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AiBotSliceReduxState } from "./types";
import { BACKEND_API_URL } from "@/src/common/lib/constant";
import { ReducerAction } from "react";

const robotImageUrl = "/images/aichat/ai-robot.png";

const initialState: AiBotSliceReduxState = {
  messages: [],
  protocolLogs: [],
  tasks: {
    1: {
      id: 1,
      task: "Create a list of key fairytale characters, settings, and plot elements for the book using text_completion tool to brainstorm creative ideas.",
      skill: "text_completion",
      icon: "🤖",
      dependent_task_ids: [],
      status: "incomplete",
    },
    2: {
      id: 2,
      task: "Generate images of the main fairytale characters and settings to visually represent the world of the story using image_generation tool.",
      skill: "image_generation",
      icon: "📸",
      dependent_task_ids: [],
      status: "incomplete",
    },
    3: {
      id: 3,
      task: "Write a brief fairytale narrative based on the elements identified, incorporating the characters, settings, and plot points.",
      skill: "text_completion",
      icon: "🤖",
      dependent_task_ids: [],
      status: "incomplete",
    },
    4: {
      id: 4,
      task: "Search for relevant fairytale storytelling techniques on YouTube to enhance the storytelling aspect of the book using video_search tool.",
      skill: "video_search",
      icon: "🎥",
      dependent_task_ids: [],
      status: "incomplete",
    },
    5: {
      id: 5,
      task: "Illustrate the fairytale book cover design based on the generated images and narrative, bringing the elements together for a captivating visual representation.",
      skill: "image_generation",
      icon: "📸",
      dependent_task_ids: [2, 3],
      status: "incomplete",
    },
  },
  status: {
    botThinking: false,
  },
  error: {
    fetchAll: null,
  },
};

export const scrollToBottom = createAsyncThunk<any, { searchTerm: string }>(
  "aiBot/fetchDataset",
  async ({ searchTerm }) => {
    const res = await axios.post(`${BACKEND_API_URL}v2/dataset/search`, {
      searchTerm: searchTerm.trim(),
    });
    return res.data;
  }
);

export const fetchDataset = createAsyncThunk<any, { searchTerm: string }>(
  "aiBot/fetchDataset",
  async ({ searchTerm }) => {
    const res = await axios.post(`${BACKEND_API_URL}v2/dataset/search`, {
      searchTerm: searchTerm.trim(),
    });
    return res.data;
  }
);

export const executeTask = createAsyncThunk<any, { task: any }>(
  "aiBot/executeTask",
  async ({ task }) => {
    if (task.skill === "text_completion") {
      const res = await axios.post(`${BACKEND_API_URL}v2/chat`, {
        prompt: task.task,
      });
      return { ...res.data, task };
    } else if (task.skill === "image_generation") {
      const res = await axios.post(`${BACKEND_API_URL}v2/chat/image`, {
        prompt: task.task,
      });
      return { ...res.data, task };
    } else if (task.skill === "video_search") {
      const res = await axios.post(`${BACKEND_API_URL}v2/websearch/video`, {
        prompt: task.task,
      });
      return { ...res.data, task };
    }
  }
);

export const fetchAnalyzeDataset = createAsyncThunk<any, { ref: string }>(
  "aiBot/fetchAnalyzeDataset",
  async ({ ref }) => {
    const res = await axios.post(`${BACKEND_API_URL}v2/dataset/analyze`, {
      dataset: ref,
    });
    return res.data;
  }
);

export const fetchTasklist = createAsyncThunk<any, { searchTerm: string }>(
  "aiBot/fetchTasklist",
  async ({ searchTerm }) => {
    const res = await axios.post(`${BACKEND_API_URL}v2/chat/tasklist`, {
      prompt: searchTerm.trim(),
    });
    return res.data;
  }
);

export const fetchWebSearch = createAsyncThunk<any, { searchTerm: string }>(
  "aiBot/fetchWebSearch",
  async ({ searchTerm }) => {
    const res = await axios.post(`${BACKEND_API_URL}v2/websearch`, {
      prompt: searchTerm.trim(),
    });
    return res.data;
  }
);

export const fetchVideoSearch = createAsyncThunk<any, { searchTerm: string }>(
  "aiBot/fetchVideoSearch",
  async ({ searchTerm }) => {
    const res = await axios.post(`${BACKEND_API_URL}v2/websearch/video`, {
      prompt: searchTerm.trim(),
    });
    return res.data;
  }
);

export const fetchImageGeneration = createAsyncThunk<
  any,
  { searchTerm: string }
>("aiBot/fetchImageGeneration", async ({ searchTerm }) => {
  const res = await axios.post(`${BACKEND_API_URL}v2/chat/image`, {
    prompt: searchTerm.trim(),
  });
  return res.data;
});

export const fetchMeme = createAsyncThunk<
  any,
  { searchTerm: string; meme: boolean }
>("aiBot/fetchMeme", async ({ searchTerm, meme }) => {
  const res = await axios.post(`${BACKEND_API_URL}v2/joke`, {
    meme,
    searchTerm: searchTerm.trim(),
  });
  return res.data;
});

export const fetchLogoAgent = createAsyncThunk<
  any,
  { logoAIAgent: { service: string; price: number } }
>("aiBot/fetchLogoAgent", async ({ logoAIAgent }) => {
  const res = await axios.post(`${BACKEND_API_URL}v2/logo`, {
    agent: logoAIAgent.service,
    cost: logoAIAgent.price,
  });
  return res.data;
});

export const fetchChat = createAsyncThunk<any, { prompt: string }>(
  "aiBot/fetchChat",
  async ({ prompt }) => {
    const res = await axios.post(`${BACKEND_API_URL}v2/chat`, {
      prompt,
    });
    return { ...res.data, prompt };
  }
);

export const aiBotSlice = createSlice({
  name: "aiBot",
  initialState,
  reducers: {
    addInitialMessage: (state, { payload }) => {
      if (state.messages.length === 0) {
        state.messages.push({
          type: "chat",
          direction: payload.direction,
          avatarUrl: payload.avatarUrl || robotImageUrl,
          textMessage: payload.textMessage,
        });
      }
    },
    addMessage: (state, { payload }) => {
      state.messages.push({
        type: payload.type || "chat",
        direction: payload.direction,
        avatarUrl: payload.avatarUrl || robotImageUrl,
        textMessage: payload.textMessage,
        data: payload.data,
      });
    },
    addProtocolLog: (state, { payload }) => {
      updateProtocolLogsState(state, payload);
    },
    setBotStatus: (state, { payload }) => {
      state.status.botThinking = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      /**
       * Dataset
       */
      .addCase(fetchDataset.pending, (state) => {
        state.status.botThinking = true;
      })
      .addCase(fetchDataset.fulfilled, (state, action) => {
        state.status.botThinking = false;
        state.messages.push({
          type: "dataset",
          avatarUrl: robotImageUrl,
          textMessage: action.payload.body,
          data: action.payload.datasets || [],
        });
        updateProtocolLogsState(state, action);
      })
      .addCase(fetchDataset.rejected, (state) => {
        state.status.botThinking = false;
        state.error.fetchAll = "Something went wrong";
      })
      /**
       * Dataset Analysis
       */
      .addCase(fetchAnalyzeDataset.pending, (state) => {
        state.status.botThinking = true;
      })
      .addCase(fetchAnalyzeDataset.fulfilled, (state, action) => {
        state.status.botThinking = false;
        state.messages.push({
          type: "chat",
          avatarUrl: robotImageUrl,
          textMessage: action.payload.body,
        });
        updateProtocolLogsState(state, action);
      })
      .addCase(fetchAnalyzeDataset.rejected, (state) => {
        state.status.botThinking = false;
        state.error.fetchAll = "Something went wrong";
      })
      /**
       * Tasklist
       */
      .addCase(fetchTasklist.pending, (state) => {
        state.status.botThinking = true;
      })
      .addCase(fetchTasklist.fulfilled, (state, action) => {
        state.status.botThinking = false;
        state.messages.push({
          type: "tasklist",
          avatarUrl: robotImageUrl,
          textMessage: action.payload.body,
          data: action.payload.tasks || [],
        });
        state.tasks = state.tasks.concat(action.payload.tasks);
        updateProtocolLogsState(state, action);
      })
      .addCase(fetchTasklist.rejected, (state) => {
        state.status.botThinking = false;
        state.error.fetchAll = "Something went wrong";
      })
      /**
       * WebSearch
       */
      .addCase(fetchWebSearch.pending, (state) => {
        state.status.botThinking = true;
      })
      .addCase(fetchWebSearch.fulfilled, (state, action) => {
        state.status.botThinking = false;
        state.messages.push({
          type: "websearch",
          avatarUrl: robotImageUrl,
          textMessage: action.payload.body,
          data: action.payload.results || [],
        });
        updateProtocolLogsState(state, action);
      })
      .addCase(fetchWebSearch.rejected, (state) => {
        state.status.botThinking = false;
        state.error.fetchAll = "Something went wrong";
      })
      /**
       * VideoSearch
       */
      .addCase(fetchVideoSearch.pending, (state) => {
        state.status.botThinking = true;
      })
      .addCase(fetchVideoSearch.fulfilled, (state, action) => {
        state.status.botThinking = false;
        state.messages.push({
          type: "videosearch",
          avatarUrl: robotImageUrl,
          textMessage: action.payload.body,
          data: action.payload.results || [],
        });
        updateProtocolLogsState(state, action);
      })
      .addCase(fetchVideoSearch.rejected, (state) => {
        state.status.botThinking = false;
        state.error.fetchAll = "Something went wrong";
      })
      /**
       * Generate Image
       */
      .addCase(fetchImageGeneration.pending, (state) => {
        state.status.botThinking = true;
      })
      .addCase(fetchImageGeneration.fulfilled, (state, action) => {
        state.status.botThinking = false;
        state.messages.push({
          type: "chat",
          avatarUrl: robotImageUrl,
          textMessage: action.payload.body,
        });
        const logs = action.payload.quote || [action.payload.payment];
        updateProtocolLogsState(state, action);
      })
      .addCase(fetchImageGeneration.rejected, (state) => {
        state.status.botThinking = false;
        state.error.fetchAll = "Something went wrong";
      })
      /**
       * Meme
       */
      .addCase(fetchMeme.pending, (state) => {
        state.status.botThinking = true;
      })
      .addCase(fetchMeme.fulfilled, (state, action) => {
        state.status.botThinking = false;
        state.messages.push({
          type: "chat",
          avatarUrl: robotImageUrl,
          textMessage: action.payload.body || action.payload.joke,
          data: action.payload.memeUrl || [],
        });
        updateProtocolLogsState(state, action);
      })
      .addCase(fetchMeme.rejected, (state) => {
        state.status.botThinking = false;
        state.error.fetchAll = "Something went wrong";
      })
      /**
       * Logo
       */
      .addCase(fetchLogoAgent.pending, (state) => {
        state.status.botThinking = true;
      })
      .addCase(fetchLogoAgent.fulfilled, (state, action) => {
        state.status.botThinking = false;
        state.messages.push({
          type: "chat",
          avatarUrl: robotImageUrl,
          textMessage: action.payload.body,
          data: action.payload.logoUrl || [],
        });
        updateProtocolLogsState(state, action);
      })
      .addCase(fetchLogoAgent.rejected, (state) => {
        state.status.botThinking = false;
        state.error.fetchAll = "Something went wrong";
      })
      /**
       * Chat
       */
      .addCase(fetchChat.pending, (state) => {
        state.status.botThinking = true;
      })
      .addCase(fetchChat.fulfilled, (state, action) => {
        state.status.botThinking = false;
        state.messages.push({
          type: "chat",
          avatarUrl: robotImageUrl,
          textMessage: action.payload.body,
        });
        updateProtocolLogsState(state, action);
      })
      .addCase(fetchChat.rejected, (state) => {
        state.status.botThinking = false;
        state.error.fetchAll = "Something went wrong";
      })
      /**
       * Execute Tasks
       */
      .addCase(executeTask.pending, (state, action) => {
        state.tasks[action.meta.arg.task.id].status = "pending";
      })
      .addCase(executeTask.fulfilled, (state, action) => {
        state.tasks[action.payload.task.id].status = "complete";
        state.tasks[action.payload.task.id].result = action.payload.body;
        // state.messages.push({
        //   type: "chat",
        //   avatarUrl: robotImageUrl,
        //   textMessage: action.payload.body,
        // });
        updateProtocolLogsState(state, action);
      })
      .addCase(executeTask.rejected, (state, action) => {
        state.tasks[action.meta.arg.task.id].status = "error";
        state.error.fetchAll = "Something went wrong";
      });
  },
});

function updateProtocolLogsState(
  state: AiBotSliceReduxState,
  action: PayloadAction<any>
) {
  const logs = action.payload.quote || [action.payload.payment];
  if (logs) {
    state.protocolLogs = [...state.protocolLogs, ...logs];
  }
}

export const useAiBotSelector = (state: any) => {
  return state?.aiBot;
};

export const useProtocolLogsSelector = (state: any) => {
  return state?.aiBot?.protocolLogs;
};

export const useTasklistSelector = (state: any) => {
  return state?.aiBot?.tasks;
};

export const { addInitialMessage, addMessage, addProtocolLog, setBotStatus } =
  aiBotSlice.actions;

export default aiBotSlice.reducer;
