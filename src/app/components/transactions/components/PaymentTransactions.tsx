import { Badge, Table } from "flowbite-react";
import { useEffect } from "react";
import {
  fetchAllTransactions,
  fetchUserClaims,
  fetchUserTransactions,
  useDashboardSelector,
} from "@/src/app/reducers/dashboardSlice";
import { AppDispatch } from "@/src/store";
import { useDispatch, useSelector } from "react-redux";
import { CommonTransaction } from "@/src/app/reducers/types";
import Link from "next/link";
import { useAuthSelector } from "@/src/app/reducers/authentication";

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

function PaymentRow(tx: CommonTransaction, index: number) {
  const payment = tx.payment;
  return (
    <Table.Row
      key={index}
      className="bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <Table.Cell>
        <Badge className="inline-block">{tx?.type}</Badge>
      </Table.Cell>
      <Table.Cell>
        <StatusBadge status={tx?.status} />
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {payment?.sourceName
          ? payment?.sourceName.replace("Supermojo", "Skyfire")
          : ""}
      </Table.Cell>
      <Table.Cell>{payment?.destinationName}</Table.Cell>
      <Table.Cell>{Number(payment?.value) / 1000000} USDC</Table.Cell>
      <Table.Cell>
        <Link href={`https://www.oklink.com/amoy/tx/${tx.txHash}`}>
          {tx.txHash}
        </Link>
      </Table.Cell>
      <Table.Cell></Table.Cell>
    </Table.Row>
  );
}

export default function PaymentTransactions() {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions } = useSelector(useDashboardSelector);
  const auth = useSelector(useAuthSelector);

  useEffect(() => {
    dispatch(fetchUserTransactions({ walletAddress: auth.user.walletAddress }));
  }, [auth]);

  return (
    <div>
      <div className=" w-full">
        <Table striped>
          <Table.Head>
            <Table.HeadCell>Type</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Source</Table.HeadCell>
            <Table.HeadCell>Destination Service</Table.HeadCell>
            <Table.HeadCell>Amount</Table.HeadCell>
            <Table.HeadCell>TxHash</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {transactions.map(PaymentRow)}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
