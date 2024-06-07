import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  AiBotSliceReduxState,
  ChatMessageType,
  PaymentType,
  Task,
} from "./types";
import api from "@/src/lib/api";

const robotImageUrl = "/images/aichat/ai-robot.png";

const initialState: AiBotSliceReduxState = {
  messages: [],
  protocolLogs: [],
  protocolLogsV2: null,
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

export const postChat = createAsyncThunk<any, { chatType: string; data: any }>(
  "aiBot/postChat",
  async ({ chatType, data }) => {
    const res = await api.post(`/api/chat`, {
      chatType,
      data,
    });
    return { ...res.data, prompt, type: chatType, uuid: new Date().getTime() };
  },
);

export const executeTask = createAsyncThunk<any, { task: any }>(
  "aiBot/executeTask",
  async ({ task }, thunkAPI) => {
    const state: any = thunkAPI.getState();
    const { tasks } = state.aiBot;

    const dependentTasksResults = task.dependent_task_ids.reduce(
      (allResults: [], id: number) => {
        const dependentTask = tasks[`${task.parentId}-${id}`];
        if (dependentTask.status === "complete") {
          // TODO: This is only supporting websearch results for now.

          let results = dependentTask.result?.results; // Search
          if (dependentTask.skill === "text_completion") {
            // Perplexity
            results = [
              {
                title: dependentTask.result?.prompt,
                description: dependentTask.result?.body,
              },
            ];
          }
          if (!results) return allResults;

          return [
            ...allResults,
            ...results.map((result: any) => {
              const { title, description, snippet } = result;
              return { title, description: description || snippet }; // Result doesn't have "description", so use snippet for now
            }),
          ];
        }
      },
      [],
    );

    const res = await api.post(`/api/chat`, {
      chatType: task.skill,
      data: {
        prompt: task.task,
        objective: task.objective,
        dependentTasks: dependentTasksResults,
      },
    });
    return { ...res.data, task };
  },
);

export const fetchLogoAgent = createAsyncThunk<
  any,
  { logoAIAgent: { service: string; price: number } }
>("aiBot/fetchLogoAgent", async ({ logoAIAgent }) => {
  const res = await api.post(`v1/receivers/logo`, {
    agent: logoAIAgent.service,
    cost: logoAIAgent.price,
  });
  return { ...res.data, type: "logo", uuid: new Date().getTime() };
});

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
       * PostChat
       */
      .addCase(postChat.pending, processPending)
      .addCase(postChat.fulfilled, (state, action) => {
        let data;
        switch (action.payload.type) {
          case "dataset_search":
            data = action.payload.datasets || [];
            break;
          case "tasklist":
            data =
              action.payload.tasks.map(
                (task: { id: number }) => `${state.taskGroupIndex}-${task.id}`,
              ) || [];
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
                      objective: action.payload.prompt,
                    },
                  };
                },
                {},
              ),
            };
            state.taskGroupIndex++;
            break;
          case "web_search":
            data = action.payload.results || [];
            break;
          case "video_search":
            data = action.payload.results || [];
            break;
          case "meme":
            data = action.payload.imageUrl;
            break;
          case "image_generation":
            data = action.payload.imageUrl;
            break;
        }
        state.messages.push({
          uuid: action.payload.uuid,
          type: action.payload.type as ChatMessageType["type"],
          avatarUrl: robotImageUrl,
          data: data,
          textMessage: action.payload.body,
        });
        processFulfilled(state, action);
      })
      .addCase(postChat.rejected, processError)

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
      })

      /**
       * Logo
       */
      .addCase(fetchLogoAgent.pending, processPending)
      .addCase(fetchLogoAgent.fulfilled, (state, action) => {
        state.messages.push({
          uuid: action.payload.uuid,
          type: "chat",
          avatarUrl: robotImageUrl,
          textMessage: action.payload.prompt,
          data: action.payload.imageUrl || [],
        });
        processFulfilled(state, action);
      })
      .addCase(fetchLogoAgent.rejected, processError);
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

function updateProtocolLogsState(
  state: AiBotSliceReduxState,
  action: PayloadAction<any>,
) {
  const logs = action.payload.quote || [action.payload.payment];
  if (logs) {
    state.protocolLogs = [...state.protocolLogs, ...logs];
  }
}
function processPending(state: AiBotSliceReduxState) {
  state.status.botThinking = true;
  state.shouldScrollToBottom = true;
}
function processError(state: AiBotSliceReduxState) {
  state.status.botThinking = false;
  state.error.fetchAll = "Something went wrong";
}
function processFulfilled(state: AiBotSliceReduxState, action: PayloadAction) {
  updateProtocolLogsState(state, action);
  state.status.botThinking = false;
  state.shouldScrollToBottom = true;
}

export const {
  addInitialMessage,
  addMessage,
  addProtocolLog,
  setBotStatus,
  setShouldScrollToBottom,
} = aiBotSlice.actions;

export default aiBotSlice.reducer;
