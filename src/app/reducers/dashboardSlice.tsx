import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CommonTransaction,
  DashboardReduxState,
  Wallet,
  WalletType,
} from "./types";
import { BACKEND_API_URL } from "@/src/common/lib/constant";
import demoTsx from "./demoTxs";

const initialState: DashboardReduxState = {
  status: {},
  reservedWallets: {
    Sender: [
      {
        name: "Skyfire Demo",
        address: "0x45c83889BD84D5FB77039B67C30695878f506313",
      },
    ],
    Receiver: [
      {
        name: "Reserved",
        address: "0x434c55cB06B0a8baa90588eA9eC94985069AaF51",
      },
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

export const fetchBalances = createAsyncThunk<any>(
  "dashboard/fetchBalances",
  async () => {
    // const res = await axios.get(`${BACKEND_API_URL}v2/transactions`);
    // return res.data;
  },
);

export const fetchAllTransactions = createAsyncThunk<any>(
  "dashboard/fetchAllTransactions",
  async () => {
    const res = await axios.get(`${BACKEND_API_URL}v2/transactions`);
    return res.data;
  },
);

export const fetchWallets = createAsyncThunk<any, { walletType: string }>(
  "dashboard/fetchWallets",
  async ({ walletType }) => {
    const res = await axios.get(
      `${BACKEND_API_URL}v2/wallet?walletType=${walletType}`,
    );

    return { wallets: res.data, walletType };
  },
);

export const createClaim = createAsyncThunk<any>(
  "dashboard/createClaim",
  async () => {
    // const res = await axios.post(`${BACKEND_API_URL}v2/transactions/redeem`);
    // return res.data;
  },
);

export const redeemClaims = createAsyncThunk<any>(
  "dashboard/redeemClaims",
  async () => {
    const res = await axios.post(`${BACKEND_API_URL}v2/transactions/redeem`);
    return res.data;
  },
);

export const transferFund = createAsyncThunk<
  any,
  {
    sourceAddress: string;
    address: string;
    amount: string;
    currency: string;
  }
>(
  "dashboard/transferFund",
  async ({ sourceAddress, address, amount, currency }) => {
    const res = await axios.post(`${BACKEND_API_URL}v2/wallet/transfer`, {
      sourceAddress: sourceAddress,
      destinationAddress: address,
      amount: amount,
      currency: currency,
    });
    return res.data;
  },
);

export const createWallet = createAsyncThunk<any, { data: any }>(
  "dashboard/createWallet",
  async ({ data }, thunkAPI) => {
    const price = Number(data.price) * 1000000;
    const service = data.service;
    const res = await axios.post(`${BACKEND_API_URL}v2/wallet`, {
      price,
      serviceName: service,
      description: data.description,
      website: data.website,
    });
    return { ...res, service, price };
  },
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
        state.wallets[walletType as WalletType] = wallets.sort(
          (w1: Wallet, w2: Wallet) => {
            const isReserved = state.reservedWallets[
              walletType as WalletType
            ].find((rWallet: Wallet) => {
              return w1.address === rWallet.address;
            });
            if (isReserved) return -1;

            const isReserved2 = state.reservedWallets[
              walletType as WalletType
            ].find((rWallet: Wallet) => {
              return w2.address === rWallet.address;
            });
            if (isReserved2) return 1;

            return (
              new Date(w2.createdAt as string).getTime() -
              new Date(w1.createdAt as string).getTime()
            );
          },
        );
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
        // state.transactions = action.payload.transactions || [];
        state.transactions = demoTsx as CommonTransaction[];
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
      })
      /**
       * Redeem Claims
       */
      .addCase(redeemClaims.pending, (state, action) => {
        state.status["redeemClaims"] = "pending";
      })
      .addCase(redeemClaims.fulfilled, (state, action) => {
        state.status["redeemClaims"] = "succeeded";
      })
      .addCase(redeemClaims.rejected, (state, action) => {
        state.status["redeemClaims"] = "failed";
      })
      /**
       * Fetch Balances
       */
      .addCase(fetchBalances.pending, (state, action) => {
        state.status["fetchBalances"] = "pending";
      })
      .addCase(fetchBalances.fulfilled, (state, action) => {
        state.status["fetchBalances"] = "succeeded";
      })
      .addCase(fetchBalances.rejected, (state, action) => {
        state.status["fetchBalances"] = "failed";
      })
      /**
       * Transfer Fund
       */
      .addCase(transferFund.pending, (state, action) => {
        state.status["transferFund"] = "pending";
      })
      .addCase(transferFund.fulfilled, (state, action) => {
        state.status["transferFund"] = "succeeded";
      })
      .addCase(transferFund.rejected, (state, action) => {
        state.status["transferFund"] = "failed";
      });
  },
});

export const useDashboardSelector = (state: any) => {
  return state?.dashboard;
};

export const useBalanceSelector = (state: any) => {
  const transactions = state?.dashboard?.transactions || [];
  const wallets = state?.dashboard?.wallets || { Sender: [], Receiver: [] };

  // TODO: Calculation might not be acculate.
  const amount = transactions.reduce(
    (acc: { received: number; paid: number }, tx: CommonTransaction) => {
      if (tx.type === "REDEMPTION" && tx.status === "SUCCESS") {
        acc.received += Number(tx.redemption?.amounts.total || 0) / 1000000;
      } else if (tx.type === "PAYMENT") {
        acc.paid += Number(tx.payment?.value || 0) / 1000000;
      }
      return acc;
    },
    { received: 0, paid: 0 },
  );

  return amount;
};

export const { resetStatus } = dashboardSlice.actions;

export default dashboardSlice.reducer;
