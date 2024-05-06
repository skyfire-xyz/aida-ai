"use client";
import { Provider, useDispatch, useSelector } from "react-redux";
import { AppDispatch, store } from "@/src/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, useAuthSelector } from "./reducers/authentication";
import { DarkThemeWrapper } from "./dashboard/DarkThemeWrapper";

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector(useAuthSelector);

  useEffect(() => {
    dispatch(getUser());
  }, []);
  useEffect(() => {
    if (auth.init && !auth.user) {
      router.push("/signin");
    } else if (auth.init && auth.user) {
      router.push("/dashboard");
    }
  }, [auth]);

  if (!auth.init || !auth.user) {
    return (
      <DarkThemeWrapper>
        <div></div>
      </DarkThemeWrapper>
    );
  }
  return <>{children}</>;
}
