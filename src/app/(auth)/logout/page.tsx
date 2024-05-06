"use client";

import { AppDispatch } from "@/src/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../reducers/authentication";
import { useRouter } from "next/navigation";
import { resetState } from "../../reducers/dashboardSlice";

function Logout() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  useEffect(() => {
    dispatch(setUser({}));
    dispatch(resetState());
    router.push("/signin");
  }, []);
  return null;
}

export default Logout;
