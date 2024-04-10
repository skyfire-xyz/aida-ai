import axios from "axios";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AiBotSliceReduxState } from "./types";
import { BACKEND_API_URL } from "@/src/common/lib/constant";
import { ReducerAction } from "react";

const robotImageUrl = "/images/aichat/ai-robot.png";

const initialState: AiBotSliceReduxState = {
  messages: [],
  protocolLogs: [],
  status: {
    botThinking: false,
  },
  error: {
    fetchAll: null,
  },
};

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
        type: "chat",
        direction: payload.direction,
        avatarUrl: payload.avatarUrl || robotImageUrl,
        textMessage: payload.textMessage,
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

export const { addInitialMessage, addMessage, addProtocolLog, setBotStatus } =
  aiBotSlice.actions;

export default aiBotSlice.reducer;
