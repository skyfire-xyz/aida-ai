"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import chatSlice from "./app/reducers/chatSlice";
import protocolLogsSlice from "./app/reducers/protocolLogsSlice";
import uiEffectSlice from "./app/reducers/uiEffectSlice";

export const store = configureStore({
  reducer: combineReducers({
    chat: chatSlice,
    protocolLogs: protocolLogsSlice,
    uiEffect: uiEffectSlice,
  }),
});

export type AppDispatch = typeof store.dispatch;
