"use client";

import PaymentTransactions from "../../components/transactions/components/PaymentTransactions";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <PaymentTransactions />
    </div>
  );
}
