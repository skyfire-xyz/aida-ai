import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AuthenticationReduxState } from "./types";
import { getSessionData, setSessionData } from "@/src/common/lib/utils";
import axios from "axios";
import { AIDA_USER_ID, BACKEND_API_URL } from "@/src/common/lib/constant";
import api from "@/src/common/lib/api";
import { LoginFormInput } from "../(auth)/signin/page";
import { stat } from "fs";
import { useSelector } from "react-redux";

const robotImageUrl = "/images/aichat/ai-robot.png";

const initialState: AuthenticationReduxState = {
  init: false,
  status: {},
  userBalance: null,
};

function storeLocalUserInfo(user: any) {
  api.defaults.headers["x-skyfire-user"] = user.id;
  setSessionData(
    "user",
    JSON.stringify({
      ...user,
      avatar: "/images/aichat/defaultUser.png",
    }),
  );
}

export const createSenderWallet = createAsyncThunk<any, { data: any }>(
  "authentication/createSenderWallet",
  async ({ data }, thunkAPI) => {
    const res = await axios.post(`${BACKEND_API_URL}v1/users/sender`, {
      username: data.username,
    });
    return res.data;
  },
);

export const createReceiverWallet = createAsyncThunk<any, { data: any }>(
  "authentication/createReceiverWallet",
  async ({ data }, thunkAPI) => {
    const res = await axios.post(`${BACKEND_API_URL}v1/users/receiver`, {
      username: data.username,
    });
    return res.data;
  },
);

export const signInUser = createAsyncThunk<any, LoginFormInput>(
  "authentication/signInUser",
  async ({ username, password }, thunkAPI) => {
    const res = await axios.post(`${BACKEND_API_URL}v1/login`, {
      username: username,
      password: password,
    });
    return res.data;
  },
);

export const getUserBalance = createAsyncThunk<any>(
  "authentication/getUserBalance",
  async (_, thunkAPI) => {
    const auth = useAuthSelector(thunkAPI.getState());
    const res = await api.get(
      `v1/wallet/balance?address=${auth.user.walletAddress}`,
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
        const userObj = JSON.parse(user);
        state.user = userObj;
        storeLocalUserInfo(userObj);
      }
      state.init = true;
    },
    setUser: (state, { payload }) => {
      if (!payload.username) {
        state.user = undefined;
        setSessionData("user", "");
        api.defaults.headers["x-skyfire-user"] = "";
      } else {
        state.user = {
          ...payload,
          avatar: "/images/aichat/defaultUser.png",
        };
        storeLocalUserInfo(payload);
      }
    },
    resetStatus: (state, action) => {
      state.status[action.payload.key] = action.payload.status;
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
          ...action.payload,
          avatar: "/images/aichat/defaultUser.png",
        };
        storeLocalUserInfo(action.payload);
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
        state.user = action.payload;
        storeLocalUserInfo(action.payload);
      })
      .addCase(createSenderWallet.rejected, (state, action) => {
        state.status["createSenderWallet"] = "failed";
      })
      /**
       * createReceiverWallet
       */
      .addCase(createReceiverWallet.pending, (state, action) => {
        state.status["createReceiverWallet"] = "pending";
      })
      .addCase(createReceiverWallet.fulfilled, (state, action) => {
        state.status["createReceiverWallet"] = "succeeded";
        state.user = action.payload;
        storeLocalUserInfo(action.payload);
      })
      .addCase(createReceiverWallet.rejected, (state, action) => {
        state.status["createReceiverWallet"] = "failed";
      })
      /**
       * User Balance
       */
      .addCase(getUserBalance.pending, (state, action) => {
        state.status["getUserBalance"] = "pending";
      })
      .addCase(getUserBalance.fulfilled, (state, action) => {
        state.status["getUserBalance"] = "succeeded";
        state.userBalance = action.payload;
      })
      .addCase(getUserBalance.rejected, (state, action) => {
        state.status["getUserBalance"] = "failed";
      });
  },
});

export const useAuthSelector = (state: any) => {
  return state?.authentication;
};

export const userBalanceSelector = (state: any) => {
  return state?.authentication?.userBalance;
};

export const { setUser, getUser, resetStatus } = authenticationSlice.actions;

export default authenticationSlice.reducer;
