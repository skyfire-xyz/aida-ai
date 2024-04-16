"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import aiBotSlice from "./app/reducers/aiBotSlice";
import dashboardSlice from "./app/reducers/dashboardSlice";

export const store = configureStore({
  reducer: combineReducers({
    aiBot: aiBotSlice,
    dashboard: dashboardSlice,
  }),
});

export type AppDispatch = typeof store.dispatch;
