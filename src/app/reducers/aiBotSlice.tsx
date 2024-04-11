import axios from "axios";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AiBotSliceReduxState } from "./types";
import { BACKEND_API_URL } from "@/src/common/lib/constant";
import { ReducerAction } from "react";

const robotImageUrl = "/images/aichat/ai-robot.png";

const initialState: AiBotSliceReduxState = {
  messages: [],
  protocolLogs: [],
  tasks: {},
  shouldScrollToBottom: false,
  status: {
    botThinking: false,
  },
  error: {
    fetchAll: null,
  },
};

export const executeTask = createAsyncThunk<any, { task: any }>(
  "aiBot/executeTask",
  async ({ task }) => {
    if (task.skill === "text_completion") {
      const res = await axios.post(`${BACKEND_API_URL}v2/chat/perplexity`, {
        prompt: task.task,
      });
      return { ...res.data, task };
    } else if (task.skill === "random_joke") {
      const res = await axios.post(`${BACKEND_API_URL}v2/joke`, {
        searchTerm: task.task,
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
    } else if (task.skill === "web_search") {
      const res = await axios.post(`${BACKEND_API_URL}v2/websearch`, {
        prompt: task.task,
      });
      return { ...res.data, task };
    } else if (task.skill === "dataset_search") {
      const res = await axios.post(`${BACKEND_API_URL}v2/dataset/search`, {
        searchTerm: task.task,
      });
      return { ...res.data, task };
    }
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
    setShouldScrollToBottom: (state, { payload }) => {
      state.shouldScrollToBottom = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      /**
       * Dataset
       */
      .addCase(fetchDataset.pending, (state) => {
        state.status.botThinking = true;
        state.shouldScrollToBottom = true;
      })
      .addCase(fetchDataset.fulfilled, (state, action) => {
        state.status.botThinking = false;
        state.messages.push({
          type: "dataset",
          avatarUrl: robotImageUrl,
          textMessage: action.payload.prompt,
          data: action.payload.datasets || [],
        });
        updateProtocolLogsState(state, action);
        state.shouldScrollToBottom = true;
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
        state.shouldScrollToBottom = true;
      })
      .addCase(fetchAnalyzeDataset.fulfilled, (state, action) => {
        state.status.botThinking = false;
        state.messages.push({
          type: "chat",
          avatarUrl: robotImageUrl,
          textMessage: action.payload.body,
        });
        updateProtocolLogsState(state, action);
        state.shouldScrollToBottom = true;
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
        state.shouldScrollToBottom = true;
      })
      .addCase(fetchTasklist.fulfilled, (state, action) => {
        state.status.botThinking = false;
        state.messages.push({
          type: "tasklist",
          avatarUrl: robotImageUrl,
          textMessage: action.payload.prompt,
          data:
            action.payload.tasks.map((task: { task: string }) => task.task) ||
            [],
        });

        state.tasks = {
          ...state.tasks,
          ...action.payload.tasks.reduce(
            (obj: object, task: { task: string }) => {
              return { ...obj, [task.task]: task };
            },
            {}
          ),
        };
        updateProtocolLogsState(state, action);
        state.shouldScrollToBottom = true;
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
        state.shouldScrollToBottom = true;
      })
      .addCase(fetchWebSearch.fulfilled, (state, action) => {
        state.status.botThinking = false;
        state.messages.push({
          type: "websearch",
          avatarUrl: robotImageUrl,
          textMessage: action.payload.prompt,
          data: action.payload.results || [],
        });
        updateProtocolLogsState(state, action);
        state.shouldScrollToBottom = true;
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
        state.shouldScrollToBottom = true;
      })
      .addCase(fetchVideoSearch.fulfilled, (state, action) => {
        state.status.botThinking = false;
        state.messages.push({
          type: "videosearch",
          avatarUrl: robotImageUrl,
          textMessage: action.payload.prompt,
          data: action.payload.results || [],
        });
        updateProtocolLogsState(state, action);
        state.shouldScrollToBottom = true;
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
        state.shouldScrollToBottom = true;
      })
      .addCase(fetchImageGeneration.fulfilled, (state, action) => {
        state.status.botThinking = false;
        state.messages.push({
          type: "chat",
          avatarUrl: robotImageUrl,
          textMessage: action.payload.prompt,
          data: action.payload.imageUrl,
        });
        const logs = action.payload.quote || [action.payload.payment];
        updateProtocolLogsState(state, action);
        state.shouldScrollToBottom = true;
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
        state.shouldScrollToBottom = true;
      })
      .addCase(fetchMeme.fulfilled, (state, action) => {
        state.status.botThinking = false;
        state.messages.push({
          type: "chat",
          avatarUrl: robotImageUrl,
          textMessage: action.payload.joke,
          data: action.payload.imageUrl,
        });
        updateProtocolLogsState(state, action);
        state.shouldScrollToBottom = true;
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
        state.shouldScrollToBottom = true;
      })
      .addCase(fetchLogoAgent.fulfilled, (state, action) => {
        state.status.botThinking = false;
        state.messages.push({
          type: "chat",
          avatarUrl: robotImageUrl,
          textMessage: action.payload.prompt,
          data: action.payload.logoUrl || [],
        });
        updateProtocolLogsState(state, action);
        state.shouldScrollToBottom = true;
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
        state.shouldScrollToBottom = true;
      })
      .addCase(fetchChat.fulfilled, (state, action) => {
        state.status.botThinking = false;
        state.messages.push({
          type: "chat",
          avatarUrl: robotImageUrl,
          textMessage: action.payload.body,
        });
        updateProtocolLogsState(state, action);
        state.shouldScrollToBottom = true;
      })
      .addCase(fetchChat.rejected, (state) => {
        state.status.botThinking = false;
        state.error.fetchAll = "Something went wrong";
      })
      /**
       * Execute Tasks
       */
      .addCase(executeTask.pending, (state, action) => {
        state.tasks[action.meta.arg.task.task].status = "pending";
      })
      .addCase(executeTask.fulfilled, (state, action) => {
        state.tasks[action.payload.task.task].status = "complete";
        state.tasks[action.payload.task.task].result = action.payload;
        updateProtocolLogsState(state, action);
      })
      .addCase(executeTask.rejected, (state, action) => {
        state.tasks[action.meta.arg.task.task].status = "error";
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

export const {
  addInitialMessage,
  addMessage,
  addProtocolLog,
  setBotStatus,
  setShouldScrollToBottom,
} = aiBotSlice.actions;

export default aiBotSlice.reducer;
