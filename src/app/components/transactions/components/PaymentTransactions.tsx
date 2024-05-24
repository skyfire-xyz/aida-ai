import { useAuthSelector } from "@/src/app/reducers/authentication";
import {
  fetchUserTransactions,
  useDashboardSelector,
} from "@/src/app/reducers/dashboardSlice";
import { CommonTransaction } from "@/src/app/reducers/types";
import { AppDispatch } from "@/src/store";
import { Badge, Table } from "flowbite-react";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDateString } from "../../../utils";

function StatusBadge({ status }: { status: string }) {
  let color;
  if (status === "SUCCESS") color = "green";
  if (status === "FAIL") color = "red";

  return (
    <Badge className="inline-block" color={color}>
      {status}
    </Badge>
  );
}

function ClaimRow(tx: CommonTransaction, index: number) {
  const claim = tx.claim;
  return (
    <Table.Row
      key={index}
      className="bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <Table.Cell>
        <Badge color="purple" className="inline-block">
          {tx?.type}
        </Badge>
      </Table.Cell>
      <Table.Cell>
        <StatusBadge status={tx?.status} />
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {claim?.sourceName}
      </Table.Cell>
      <Table.Cell>{claim?.destinationName}</Table.Cell>
      <Table.Cell>
        {(Number(claim?.value) / 1000000).toFixed(7)} USDC
      </Table.Cell>
      <Table.Cell>
        <Link href={`https://www.oklink.com/amoy/tx/${tx.txHash}`}>
          {tx.txHash?.substring(0, 5) + "..."}
        </Link>
      </Table.Cell>
      <Table.Cell>{formatDateString(tx.createdAt)}</Table.Cell>
      <Table.Cell></Table.Cell>
    </Table.Row>
  );
}
function RedemptionRow(tx: CommonTransaction, index: number) {
  const redemption = tx.redemption;
  return (
    <Table.Row
      key={index}
      className="bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <Table.Cell>
        <Badge color="green" className="inline-block">
          {tx?.type}
        </Badge>
      </Table.Cell>
      <Table.Cell>
        <StatusBadge status={tx?.status} />
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {redemption?.sourceName}
      </Table.Cell>
      <Table.Cell>{redemption?.destinationName}</Table.Cell>
      <Table.Cell></Table.Cell>
      <Table.Cell>
        <Link href={`https://www.oklink.com/amoy/tx/${tx.txHash}`}>
          {tx.txHash?.substring(0, 5) + "..."}
        </Link>
      </Table.Cell>
      <Table.Cell>{formatDateString(tx.createdAt)}</Table.Cell>
      <Table.Cell></Table.Cell>
    </Table.Row>
  );
}
export default function PaymentTransactions() {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions } = useSelector(useDashboardSelector);
  const auth = useSelector(useAuthSelector);

  useEffect(() => {
    dispatch(fetchUserTransactions());
  }, [auth]);

  return (
    <div>
      <div className="w-full">
        <h3 className="text-3xl dark:text-white">Payment Transactions</h3>
      </div>
      <div className="mt-10 w-full">
        <Table striped>
          <Table.Head>
            <Table.HeadCell>Type</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Sender Name</Table.HeadCell>
            <Table.HeadCell>Receiver Name</Table.HeadCell>
            <Table.HeadCell>Amount</Table.HeadCell>
            <Table.HeadCell>TxHash</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {transactions
              // .filter((tx: CommonTransaction) => tx.type === "PAYMENT")
              .map((tx: CommonTransaction, index: number) => {
                if (tx.type === "CLAIM") {
                  return ClaimRow(tx, index);
                } else return RedemptionRow(tx, index);
              })}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
