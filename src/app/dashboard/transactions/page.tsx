"use client";

import { useEffect } from "react";
import ClaimsRedeems from "./components/ClaimsRedeems";
import PaymentTransactions from "./components/PaymentTransactions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/store";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <PaymentTransactions />
    </div>
  );
}
