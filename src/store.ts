"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import aiBotSlice from "./app/reducers/aiBotSlice";
import authenticationSlice from "./app/reducers/authentication";

export const store = configureStore({
  reducer: combineReducers({
    aiBot: aiBotSlice,
    authentication: authenticationSlice,
  }),
});

export type AppDispatch = typeof store.dispatch;
