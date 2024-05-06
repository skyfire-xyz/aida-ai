import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AuthenticationReduxState } from "./types";
import { getSessionData, setSessionData } from "@/src/common/lib/utils";
import axios from "axios";
import { AIDA_USER_ID, BACKEND_API_URL } from "@/src/common/lib/constant";
import api from "@/src/common/lib/api";
import { LoginFormInput } from "../(auth)/signin/page";

const robotImageUrl = "/images/aichat/ai-robot.png";

const initialState: AuthenticationReduxState = {
  init: false,
  status: {},
};

export const createSenderWallet = createAsyncThunk<any, { data: any }>(
  "authentication/createSenderWallet",
  async ({ data }, thunkAPI) => {
    const res = await axios.post(
      `${BACKEND_API_URL}v2/demo/skyfire-users/sender`,
      {
        username: data.username,
      },
    );
    return res.data;
  },
);

export const createReceiverWallet = createAsyncThunk<any, { data: any }>(
  "authentication/createReceiverWallet",
  async ({ data }, thunkAPI) => {
    const price = Number(data.price) * 1000000;
    const service = data.service;
    const res = await axios.post(
      `${BACKEND_API_URL}v2/demo/skyfire-users/receiver`,
      {
        username: data.username,
      },
    );
    return res.data;
  },
);

export const signInUser = createAsyncThunk<any, LoginFormInput>(
  "authentication/signInUser",
  async ({ username, password }, thunkAPI) => {
    const res = await axios.post(`${BACKEND_API_URL}v2/login`, {
      username: username,
      password: password,
    });
    return res.data;
  },
);

export const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    getUser: (state) => {
      const user = getSessionData("user");
      if (user) {
        const userObj = JSON.parse(user);
        state.user = userObj;
        api.defaults.headers["x-skyfire-user"] = userObj.token;
      }
      state.init = true;
    },
    setUser: (state, { payload }) => {
      if (!payload.username) {
        state.user = undefined;
        setSessionData("user", "");
        api.defaults.headers["x-skyfire-user"] = "";
      } else {
        if (payload.username.toLocaleLowerCase() === "aida") {
          api.defaults.headers["x-skyfire-user"] = AIDA_USER_ID;

          setSessionData(
            "user",
            JSON.stringify({
              token: AIDA_USER_ID,
              username: "Aida",
              avatar: "/images/aichat/defaultUser.png",
            }),
          );
          state.user = {
            token: AIDA_USER_ID,
            username: "Aida",
            avatar: "/images/aichat/defaultUser.png",
          };
        } else {
          api.defaults.headers["x-skyfire-user"] = payload.id;
          setSessionData(
            "user",
            JSON.stringify({
              token: payload.id,
              username: payload.username,
              avatar: "/images/aichat/defaultUser.png",
            }),
          );
          state.user = {
            token: payload.id,
            username: payload.username,
            avatar: "/images/aichat/defaultUser.png",
          };
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      /**
       * Sign in
       */
      .addCase(signInUser.pending, (state, action) => {
        state.status["signInUser"] = "pending";
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.status["signInUser"] = "succeeded";
        state.user = {
          username: action.payload.username,
          token: action.payload.id,
          avatar: "/images/aichat/defaultUser.png",
        };
        api.defaults.headers["x-skyfire-user"] = action.payload.id;
        setSessionData(
          "user",
          JSON.stringify({
            token: action.payload.id,
            username: action.payload.username,
            avatar: "/images/aichat/defaultUser.png",
          }),
        );
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.status["signInUser"] = "failed";
      })
      /**
       * createSenderWallet
       */
      .addCase(createSenderWallet.pending, (state, action) => {
        state.status["createSenderWallet"] = "pending";
      })
      .addCase(createSenderWallet.fulfilled, (state, action) => {
        state.status["createSenderWallet"] = "succeeded";
        state.user = {
          username: action.payload.username,
          token: action.payload.id,
        };
        setSessionData(
          "user",
          JSON.stringify({
            token: action.payload.id,
            username: action.payload.username,
            avatar: "/images/aichat/defaultUser.png",
          }),
        );
      })
      .addCase(createSenderWallet.rejected, (state, action) => {
        state.status["createSenderWallet"] = "failed";
      });
  },
});

export const useAuthSelector = (state: any) => {
  return state?.authentication;
};

export const { setUser, getUser } = authenticationSlice.actions;

export default authenticationSlice.reducer;
