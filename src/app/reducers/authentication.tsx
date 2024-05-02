import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AuthenticationReduxState } from "./types";
import { getSessionData, setSessionData } from "@/src/common/lib/utils";

const robotImageUrl = "/images/aichat/ai-robot.png";

const initialState: AuthenticationReduxState = {
  status: "idle",
};

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
      console.log("payload", payload);
      if (!payload.username) {
        state.user = undefined;
        setSessionData("user", "");
      } else {
        if (payload.username.toLocaleLowerCase() === "aida") {
          setSessionData(
            "user",
            JSON.stringify({
              token: "aaa",
              username: "Aida",
              avatar: "/images/aichat/defaultUser.png",
            }),
          );
          state.user = {
            token: "aaa",
            username: "Aida",
            avatar: "/images/aichat/defaultUser.png",
          };
        } else {
          setSessionData(
            "user",
            JSON.stringify({
              token: "aaa",
              username: "Aida",
              avatar: "/images/aichat/defaultUser.png",
            }),
          );
          state.user = {
            token: "aaa",
            username: "Aida",
            avatar: "/images/aichat/defaultUser.png",
          };
        }
      }
    },
  },
});

export const useAuthSelector = (state: any) => {
  return state?.authentication;
};

export const { setUser, getUser } = authenticationSlice.actions;

export default authenticationSlice.reducer;
