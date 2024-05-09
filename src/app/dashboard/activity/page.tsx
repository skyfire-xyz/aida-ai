"use client";

import Claims from "../../components/transactions/components/Claims";
import PaymentTransactions from "../../components/transactions/components/PaymentTransactions";
import { Tabs } from "flowbite-react";
import { MdDashboard } from "react-icons/md";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <Tabs aria-label="Transactions" style="default">
        <Tabs.Item active title="Transactions">
          <PaymentTransactions />
        </Tabs.Item>
        <Tabs.Item title="Claims">
          <Claims />
        </Tabs.Item>
      </Tabs>
    </div>
  );
}
