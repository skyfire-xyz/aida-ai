"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import aiBotSlice from "./app/reducers/aiBotSlice";

export const store = configureStore({
  reducer: combineReducers({
    aiBot: aiBotSlice,
  }),
});

export type AppDispatch = typeof store.dispatch;
