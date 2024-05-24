import { Button, Table } from "flowbite-react";
import axios from "axios";
import { BACKEND_API_URL } from "@/src/common/lib/constant";
import { useEffect } from "react";
import {
  fetchAllTransactions,
  redeemClaims,
  useDashboardSelector,
} from "@/src/app/reducers/dashboardSlice";
import { AppDispatch } from "@/src/store";
import { useDispatch, useSelector } from "react-redux";
import { CommonTransaction } from "@/src/app/reducers/types";

export default function PaymentTransactions() {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions } = useSelector(useDashboardSelector);

  useEffect(() => {
    dispatch(fetchAllTransactions());
  }, []);

  return (
    <div>
      <div className="w-full">
        <h3 className="text-3xl dark:text-white">Payment Transactions</h3>
      </div>
      <div className="mt-10 w-full">
        <Table striped>
          <Table.Head>
            <Table.HeadCell>Tx ID</Table.HeadCell>
            <Table.HeadCell>To Address</Table.HeadCell>
            <Table.HeadCell>Amount</Table.HeadCell>
            <Table.HeadCell>TxHash</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {transactions
              .filter((tx: CommonTransaction) => {
                return tx.type === "PAYMENT";
              })
              .map((tx: any, index: number) => (
                <Table.Row
                  key={index}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {tx.id}
                  </Table.Cell>
                  <Table.Cell></Table.Cell>
                  <Table.Cell>{tx.amount}</Table.Cell>
                  <Table.Cell>{tx.txHash}</Table.Cell>
                  <Table.Cell>{}</Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
