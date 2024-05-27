"use client";

import { AppDispatch } from "@/src/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../reducers/authentication";
import { useRouter } from "next/navigation";

function Logout() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  useEffect(() => {
    dispatch(setUser({}));
    router.push("/signin");
  }, []);
  return null;
}

export default Logout;
