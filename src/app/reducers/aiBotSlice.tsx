import axios from "axios";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AiBotSliceReduxState, Task } from "./types";
import { BACKEND_API_URL } from "@/src/common/lib/constant";
import { ReducerAction } from "react";

const robotImageUrl = "/images/aichat/ai-robot.png";

const initialState: AiBotSliceReduxState = {
  messages: [],
  protocolLogs: [],
  tasks: {},
  taskGroupIndex: 1,
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

function updateProtocolLogsState(
  state: AiBotSliceReduxState,
  action: PayloadAction<any>
) {
  const logs = action.payload.quote || [action.payload.payment];
  if (logs) {
    state.protocolLogs = [...state.protocolLogs, ...logs];
  }
}

const processPending = (state: AiBotSliceReduxState) => {
  state.status.botThinking = true;
  state.shouldScrollToBottom = true;
};
const processError = (state: AiBotSliceReduxState) => {
  state.status.botThinking = false;
  state.error.fetchAll = "Something went wrong";
};
const processFulfilled = (
  state: AiBotSliceReduxState,
  action: PayloadAction
) => {
  updateProtocolLogsState(state, action);
  state.status.botThinking = false;
  state.shouldScrollToBottom = true;
};

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
      state.shouldScrollToBottom = true;
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
      .addCase(fetchDataset.pending, processPending)
      .addCase(fetchDataset.fulfilled, (state, action) => {
        state.messages.push({
          type: "dataset",
          avatarUrl: robotImageUrl,
          textMessage: action.payload.prompt,
          data: action.payload.datasets || [],
        });
        processFulfilled(state, action);
      })
      .addCase(fetchDataset.rejected, processError)
      /**
       * Dataset Analysis
       */
      .addCase(fetchAnalyzeDataset.pending, processPending)
      .addCase(fetchAnalyzeDataset.fulfilled, (state, action) => {
        state.messages.push({
          type: "chat",
          avatarUrl: robotImageUrl,
          textMessage: action.payload.body,
        });
        processFulfilled(state, action);
      })
      .addCase(fetchAnalyzeDataset.rejected, processError)
      /**
       * Tasklist
       */
      .addCase(fetchTasklist.pending, processPending)
      .addCase(fetchTasklist.fulfilled, (state, action) => {
        state.messages.push({
          type: "tasklist",
          avatarUrl: robotImageUrl,
          textMessage: action.payload.prompt,
          data:
            action.payload.tasks.map(
              (task: { id: number }) => `${state.taskGroupIndex}-${task.id}`
            ) || [],
        });
        state.tasks = {
          ...state.tasks,
          ...action.payload.tasks.reduce(
            (obj: object, task: { id: number }) => {
              const parentId = state.taskGroupIndex;
              const referenceId = `${parentId}-${task.id}`;
              return {
                ...obj,
                [referenceId]: {
                  ...task,
                  referenceId,
                  parentId,
                },
              };
            },
            {}
          ),
        };
        state.taskGroupIndex++;
        processFulfilled(state, action);
      })
      .addCase(fetchTasklist.rejected, processError)
      /**
       * WebSearch
       */
      .addCase(fetchWebSearch.pending, processPending)
      .addCase(fetchWebSearch.fulfilled, (state, action) => {
        state.messages.push({
          type: "websearch",
          avatarUrl: robotImageUrl,
          textMessage: action.payload.prompt,
          data: action.payload.results || [],
        });
        processFulfilled(state, action);
      })
      .addCase(fetchWebSearch.rejected, processError)
      /**
       * VideoSearch
       */
      .addCase(fetchVideoSearch.pending, processPending)
      .addCase(fetchVideoSearch.fulfilled, (state, action) => {
        state.messages.push({
          type: "videosearch",
          avatarUrl: robotImageUrl,
          textMessage: action.payload.prompt,
          data: action.payload.results || [],
        });
        processFulfilled(state, action);
      })
      .addCase(fetchVideoSearch.rejected, processError)
      /**
       * Generate Image
       */
      .addCase(fetchImageGeneration.pending, processPending)
      .addCase(fetchImageGeneration.fulfilled, (state, action) => {
        state.messages.push({
          type: "chat",
          avatarUrl: robotImageUrl,
          textMessage: action.payload.prompt,
          data: action.payload.imageUrl,
        });
        processFulfilled(state, action);
      })
      .addCase(fetchImageGeneration.rejected, processError)
      /**
       * Meme
       */
      .addCase(fetchMeme.pending, processPending)
      .addCase(fetchMeme.fulfilled, (state, action) => {
        state.messages.push({
          type: "chat",
          avatarUrl: robotImageUrl,
          textMessage: action.payload.joke,
          data: action.payload.imageUrl,
        });
        processFulfilled(state, action);
      })
      .addCase(fetchMeme.rejected, processError)
      /**
       * Logo
       */
      .addCase(fetchLogoAgent.pending, processPending)
      .addCase(fetchLogoAgent.fulfilled, (state, action) => {
        state.messages.push({
          type: "chat",
          avatarUrl: robotImageUrl,
          textMessage: action.payload.prompt,
          data: action.payload.imageUrl || [],
        });
        processFulfilled(state, action);
      })
      .addCase(fetchLogoAgent.rejected, processError)
      /**
       * Chat
       */
      .addCase(fetchChat.pending, processPending)
      .addCase(fetchChat.fulfilled, (state, action) => {
        state.messages.push({
          type: "chat",
          avatarUrl: robotImageUrl,
          textMessage: action.payload.body,
        });
        processFulfilled(state, action);
      })
      .addCase(fetchChat.rejected, processError)
      /**
       * Execute Tasks
       */
      .addCase(executeTask.pending, (state, action) => {
        state.tasks[action.meta.arg.task.referenceId].status = "pending";
      })
      .addCase(executeTask.fulfilled, (state, action) => {
        state.tasks[action.payload.task.referenceId].status = "complete";
        state.tasks[action.payload.task.referenceId].result = action.payload;
        updateProtocolLogsState(state, action);
      })
      .addCase(executeTask.rejected, (state, action) => {
        state.tasks[action.meta.arg.task.referenceId].status = "error";
        state.error.fetchAll = "Something went wrong";
      });
  },
});

export const useAiBotSelector = (state: any) => {
  return state?.aiBot;
};

export const useProtocolLogsSelector = (state: any) => {
  return state?.aiBot?.protocolLogs;
};

export const useTasklistSelector = (state: any) => {
  // preprocess tasks
  const tasks = Object.assign({ ...state?.aiBot?.tasks });
  if (tasks && Object.keys(tasks).length > 0) {
    Object.values(state?.aiBot?.tasks).map((value) => {
      const task = value as Task;
      const dependentTasks = task.dependent_task_ids.map((id: number) => {
        const referenceId = `${task.parentId}-${id}`;
        return tasks[referenceId];
      });
      const isDependentTasksComplete = dependentTasks.every((task: any) => {
        return task.status === "complete";
      });

      tasks[task.referenceId] = {
        ...tasks[task.referenceId],
        isDependentTasksComplete,
      };
    });
  }

  return tasks;
};

export const {
  addInitialMessage,
  addMessage,
  addProtocolLog,
  setBotStatus,
  setShouldScrollToBottom,
} = aiBotSlice.actions;

export default aiBotSlice.reducer;
