import { Badge, Button, Table } from "flowbite-react";
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
import Link from "next/link";

export default function ClaimsRedeems() {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions } = useSelector(useDashboardSelector);

  useEffect(() => {
    dispatch(fetchAllTransactions());
  }, []);

  return (
    <div>
      <div className="w-full">
        <h3 className="text-3xl dark:text-white">Claims & Redemption</h3>
      </div>
      <div className="mt-10 w-full">
        <Table striped>
          <Table.Head>
            <Table.HeadCell>Type</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>TxHash</Table.HeadCell>
            <Table.HeadCell>Created</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {transactions
              .filter((tx: CommonTransaction) => {
                return tx.type === "CLAIM" || tx.type === "REDEMPTION";
              })
              .map((tx: CommonTransaction, index: number) => {
                const payment = tx.payment;
                return (
                  <Table.Row
                    key={index}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell>
                      <Badge
                        className="inline-block"
                        color={tx?.type === "CLAIM" ? "blue" : "purple"}
                      >
                        {tx?.type}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {tx?.status}
                    </Table.Cell>
                    <Table.Cell>
                      <Link href="">{tx.txHash}</Link>
                    </Table.Cell>
                    <Table.Cell>{tx?.createdAt}</Table.Cell>
                  </Table.Row>
                );
              })}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
