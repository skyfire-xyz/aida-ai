import api from "@/src/common/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CommonTransaction,
  DashboardReduxState,
  Wallet,
  WalletType,
} from "./types";

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
        name: "Gemini",
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
  claims: [],
  receivers: [],
};

export const fetchBalances = createAsyncThunk<any>(
  "dashboard/fetchBalances",
  async () => {
    // const res = await axios.get(`${BACKEND_API_URL}v2/transactions`);
    // return res.data;
  },
);

export const walletBalance = createAsyncThunk<any, { address: string }>(
  "dashboard/walletBalance",
  async (address) => {
    const res = await api.get(`v1/wallet/balance?address=${address}`);
    return res.data;
  },
);

export const fetchAllTransactions = createAsyncThunk<any>(
  "dashboard/fetchAllTransactions",
  async () => {
    const res = await api.get(`v1/wallet/transactions`);
    return res.data;
  },
);

export const fetchWallets = createAsyncThunk<any, { walletType: string }>(
  "dashboard/fetchWallets",
  async ({ walletType }) => {
    const res = await api.get(`v1/wallet?walletType=${walletType}`);

    const wallets = Array.isArray(res.data) ? res.data : [res.data];

    const balances = await Promise.all(
      wallets.map(async (w: Wallet) => {
        return await api.get(`v1/wallet/balance?address=${w.address}`);
      }),
    );
    balances.forEach((b: any, index: number) => {
      wallets[index].balance = b.data;
    });

    return {
      wallets: wallets.filter((w: Wallet) => {
        return w.type === walletType;
      }),
      walletType,
    };
  },
);

export const redeemClaims = createAsyncThunk<any, { walletAddress: string }>(
  "dashboard/redeemClaims",
  async ({ walletAddress }, thunkAPI) => {
    const r = await api.get(`v1/wallet/claims`);
    const claims = r.data.transactions;
    const sourceAddresses = claims.reduce(
      (acc: string[], claim: CommonTransaction) => {
        if (claim.claim?.sourceAddress) {
          if (acc.indexOf(claim.claim?.sourceAddress) === -1) {
            return acc.concat(claim.claim?.sourceAddress);
          }
        }
        return acc;
      },
      [],
    );
    const res = await Promise.all(
      sourceAddresses.map(async (address: string) => {
        return await api.post(`v1/users/redeem`, {
          sourceAddress: address,
        });
      }),
    );

    return res;
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
    const res = await api.post(`v1/wallet/transfer`, {
      sourceAddress: sourceAddress,
      destinationAddress: address,
      amount: amount,
      currency: currency,
    });
    return res.data;
  },
);

export const fetchUserTransactions = createAsyncThunk<
  any,
  { walletAddress: string }
>("dashboard/fetchUserTransactions", async ({ walletAddress }) => {
  const res = await api.get(`v1/wallet/transactions/${walletAddress}`);
  return res.data;
});

export const fetchUserClaims = createAsyncThunk<any, { walletAddress: string }>(
  "dashboard/fetchUserClaims",
  async ({ walletAddress }) => {
    const res = await api.get(`v1/wallet/claims`);
    return res.data;
  },
);
export const fetchReceivers = createAsyncThunk(
  "dashboard/fetchReceivers",
  async () => {
    const res = await api.get(`v1/users/receivers/list`);
    return res.data;
  },
);

export const createWallet = createAsyncThunk<any, { data: any }>(
  "dashboard/createWallet",
  async ({ data }, thunkAPI) => {
    const price = Number(data.price) * 1000000;
    const service = data.service;
    const res = await api.post(`v1/wallet`, {
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
    resetState: (state) => {
      state.status = {};
      state.wallets = {
        Sender: [],
        Receiver: [],
      };
      state.transactions = [];
      state.claims = [];
      state.receivers = [];
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
       * All Transactions
       */
      .addCase(fetchAllTransactions.pending, (state, action) => {
        state.status["fetchAllTransactions"] = "pending";
      })
      .addCase(fetchAllTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload.transactions;
      })
      .addCase(fetchAllTransactions.rejected, (state, action) => {
        state.status["fetchAllTransactions"] = "failed";
      })
      /**
       * Transactions
       */
      .addCase(fetchUserClaims.pending, (state, action) => {
        state.status["fetchUserClaims"] = "pending";
      })
      .addCase(fetchUserClaims.fulfilled, (state, action) => {
        state.claims = action.payload.transactions;
      })
      .addCase(fetchUserClaims.rejected, (state, action) => {
        state.status["fetchUserClaims"] = "failed";
      })
      /**
       * Claims
       */
      .addCase(fetchUserTransactions.pending, (state, action) => {
        state.status["fetchUserTransactions"] = "pending";
      })
      .addCase(fetchUserTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload.transactions;
      })
      .addCase(fetchUserTransactions.rejected, (state, action) => {
        state.status["fetchUserTransactions"] = "failed";
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
      })
      /**
       * Fetch Receivers
       */
      .addCase(fetchReceivers.pending, (state, action) => {
        state.status["fetchReceivers"] = "pending";
      })
      .addCase(fetchReceivers.fulfilled, (state, action) => {
        state.receivers = action.payload;
        state.status["fetchReceivers"] = "succeeded";
      })
      .addCase(fetchReceivers.rejected, (state, action) => {
        state.status["fetchReceivers"] = "failed";
      });
  },
});

export const useDashboardSelector = (state: any) => {
  console.log("HIEU state", state);
  return state?.dashboard;
};

export const useWalletBalanceSelector =
  (walletType: string, wallet: Wallet) => (state: any) => {
    const wallets = state?.dashboard?.wallets[walletType];
    const transactions = state?.dashboard?.transactions || [];
    if (wallets.length === 0) return { paid: 0, available: 0 };

    const w = wallets.find((w: Wallet) => w.address === wallet.address);

    const paid = transactions.reduce((acc: number, tx: CommonTransaction) => {
      if (
        tx.type === "PAYMENT" &&
        tx.status === "SUCCESS" &&
        tx.payment?.sourceAddress === wallet.address
      ) {
        acc += Number(tx.payment?.value || 0) / 1000000;
      }
      return acc;
    }, 0);

    const received = transactions.reduce(
      (acc: number, tx: CommonTransaction) => {
        if (
          tx.type === "PAYMENT" &&
          tx.status === "SUCCESS" &&
          tx.payment?.destinationAddress === wallet.address
        ) {
          acc += Number(tx.payment?.value || 0) / 1000000;
        }
        return acc;
      },
      0,
    );

    return {
      balance: 0,
      escrowed: 0,
      liability: 0,
      available: 0,
    };
  };

export const useBalanceSelector = (state: any) => {
  const wallets = state?.dashboard?.wallets || { Sender: [], Receiver: [] };

  // let aggregatedBalance: Wallet["balance"] = {
  //   assets: 0,
  //   total: 0,
  //   virtual: 0,
  //   escrow: {
  //     total: 0,
  //     available: 0,
  //   },
  //   liabilities: 0,
  // };

  // function aggregateBalance(wls: Wallet[], aggrBalance: Wallet["balance"]) {
  //   return wls.reduce((acc: Wallet["balance"], w: Wallet) => {
  //     if (acc) {
  //       acc.assets += w.balance?.assets || 0;
  //       acc.total += w.balance?.total || 0;
  //       acc.virtual += w.balance?.virtual || 0;
  //       acc.escrow.total += w.balance?.escrow.total || 0;
  //       acc.escrow.available += w.balance?.escrow.available || 0;
  //       acc.liabilities += w.balance?.liabilities || 0;
  //     }
  //     return acc;
  //   }, aggrBalance);
  //   return;
  // }

  // aggregatedBalance = aggregateBalance(wallets.Receiver, aggregatedBalance);

  // return aggregatedBalance;
};

export const { resetStatus, resetState } = dashboardSlice.actions;

export default dashboardSlice.reducer;
