import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CommonTransaction, DashboardReduxState, WalletType } from "./types";
import { BACKEND_API_URL } from "@/src/common/lib/constant";
import demoTransactions from "./demoTransactions.json";

const initialState: DashboardReduxState = {
  status: {},
  reservedWallets: {
    Sender: [
      { name: "", address: "0x45c83889BD84D5FB77039B67C30695878f506313" },
    ],
    Receiver: [
      { name: "", address: "0x434c55cB06B0a8baa90588eA9eC94985069AaF51" },
      { name: "Joke", address: "0xB94dD221ef1302576E2785dAFB4Bad28cbBeA540" },
      {
        name: "ChatGPT",
        address: "0x7aA161F8B72eDd5e474943c922D1e479475B9D30",
      },
      {
        name: "Dataset",
        address: "0xB23338A0F7999e322a504915590ca6A2f0fB2d90",
      },
      {
        name: "Perplexity",
        address: "0x4E3E0feD99e56d29492e44C176faB18B20aCCC57",
      },
    ],
  },
  wallets: {
    Sender: [],
    Receiver: [],
  },
  transactions: [],
};

export const fetchAllTransactions = createAsyncThunk<any>(
  "dashboard/fetchAllTransactions",
  async () => {
    const res = await axios.post(`${BACKEND_API_URL}v2/transactions`);
    return res.data;
  }
);

export const fetchWallets = createAsyncThunk<any, { walletType: string }>(
  "dashboard/fetchWallets",
  async ({ walletType }) => {
    const res = await axios.get(
      `${BACKEND_API_URL}v2/wallet?walletType=${walletType}`
    );
    return { wallets: res.data, walletType };
  }
);

export const redeemClaims = createAsyncThunk<any>(
  "dashboard/redeemClaims",
  async () => {
    const res = await axios.post(`${BACKEND_API_URL}v2/transactions`);
    return res.data;
  }
);

export const createWallet = createAsyncThunk<any, { data: any }>(
  "dashboard/createWallet",
  async ({ data }, thunkAPI) => {
    const res = await axios.post(`${BACKEND_API_URL}v2/wallet`, {
      price: Number(data.price) * 1000000,
      serviceName: data.service,
      description: data.description,
      website: data.website,
    });
    return res;
  }
);

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    resetStatus: (state, action) => {
      state.status[action.payload.key] = action.payload.status;
    },
  },
  extraReducers: (builder) => {
    builder
      /**
       * Wallets
       */
      .addCase(fetchWallets.pending, (state, action) => {
        state.status["fetchWallets"] = "pending";
      })
      .addCase(fetchWallets.fulfilled, (state, action) => {
        const { walletType, wallets } = action.payload;
        state.wallets[walletType as WalletType] = wallets;
      })
      .addCase(fetchWallets.rejected, (state, action) => {
        state.status["fetchWallets"] = "failed";
      })
      /**
       * Transactions
       */
      .addCase(fetchAllTransactions.pending, (state, action) => {
        state.status["fetchAllTransactions"] = "pending";
      })
      .addCase(fetchAllTransactions.fulfilled, (state, action) => {
        state.transactions = demoTransactions as CommonTransaction[];
      })
      .addCase(fetchAllTransactions.rejected, (state, action) => {
        state.status["fetchAllTransactions"] = "failed";
      })
      /**
       * Create Wallet
       */
      .addCase(createWallet.pending, (state, action) => {
        state.status["createWallet"] = "pending";
      })
      .addCase(createWallet.fulfilled, (state, action) => {
        state.status["createWallet"] = "succeeded";
        try {
          const key = "__storage__ai-demo";
          if (window) {
            window["localStorage"].setItem(key, JSON.stringify(action.payload));
          }
        } catch {}
      })
      .addCase(createWallet.rejected, (state, action) => {
        state.status["createWallet"] = "failed";
      });
  },
});

export const useDashboardSelector = (state: any) => {
  return state?.dashboard;
};

export const { resetStatus } = dashboardSlice.actions;

export default dashboardSlice.reducer;
