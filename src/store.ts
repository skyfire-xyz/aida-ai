"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import aiBotSlice from "./app/reducers/aiBotSlice";
import dashboardSlice from "./app/reducers/dashboardSlice";
import authenticationSlice from "./app/reducers/authentication";

export const store = configureStore({
  reducer: combineReducers({
    aiBot: aiBotSlice,
    dashboard: dashboardSlice,
    authentication: authenticationSlice,
  }),
});

export type AppDispatch = typeof store.dispatch;
