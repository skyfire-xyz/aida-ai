"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import chatMessageSlice from "./app/reducers/chatMessagesSlice";

export const store = configureStore({
  reducer: combineReducers({
    chatMessage: chatMessageSlice,
  }),
});

export type AppDispatch = typeof store.dispatch;
