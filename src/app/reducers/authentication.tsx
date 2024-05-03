import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AuthenticationReduxState } from "./types";
import { getSessionData, setSessionData } from "@/src/common/lib/utils";
import axios from "axios";
import { BACKEND_API_URL } from "@/src/common/lib/constant";
import api from "@/src/common/lib/api";

const robotImageUrl = "/images/aichat/ai-robot.png";

const initialState: AuthenticationReduxState = {
  status: {},
};

export const createSenderWallet = createAsyncThunk<any, { data: any }>(
  "dashboard/createSenderWallet",
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
  "dashboard/createReceiverWallet",
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

export const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    getUser: (state) => {
      const user = getSessionData("user");
      if (user) {
        state.user = JSON.parse(user);
      }
    },
    setUser: (state, { payload }) => {
      if (!payload.username) {
        state.user = undefined;
        setSessionData("user", "");
        api.defaults.headers["x-skyfire-user"] = "";
      } else {
        const token = "b5c61e12-20d0-4c14-8eba-76aba6036ee9";

        if (payload.username.toLocaleLowerCase() === "aida") {
          api.defaults.headers["x-skyfire-user"] = token;

          setSessionData(
            "user",
            JSON.stringify({
              token: token,
              username: "Aida",
              avatar: "/images/aichat/defaultUser.png",
            }),
          );
          state.user = {
            token: token,
            username: "Aida",
            avatar: "/images/aichat/defaultUser.png",
          };
        } else {
          setSessionData(
            "user",
            JSON.stringify({
              token: token,
              username: "Aida",
              avatar: "/images/aichat/defaultUser.png",
            }),
          );
          state.user = {
            token: token,
            username: "Aida",
            avatar: "/images/aichat/defaultUser.png",
          };
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
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
