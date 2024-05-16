import { Badge, Button, Table } from "flowbite-react";
import { useEffect } from "react";
import {
  fetchAllTransactions,
  fetchUserClaims,
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

function ClaimRow(tx: CommonTransaction, index: number) {
  const claim = tx.claim;
  return (
    <Table.Row
      key={index}
      className="bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <Table.Cell>
        <StatusBadge status={tx?.status} />
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {claim?.sourceAddress
          ? claim?.sourceAddress.replace("Supermojo", "Skyfire")
          : ""}
      </Table.Cell>
      <Table.Cell>{claim?.destinationAddress}</Table.Cell>
      <Table.Cell>{Number(claim?.value) / 1000000} USDC</Table.Cell>
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
        <StatusBadge status={tx?.status} />
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {redemption?.sourceAddress
          ? redemption?.sourceAddress.replace("Supermojo", "Skyfire")
          : ""}
      </Table.Cell>
      <Table.Cell>{redemption?.destinationAddress}</Table.Cell>
      <Table.Cell>
        {Number(redemption?.amounts.total) / 1000000} USDC
      </Table.Cell>
      <Table.Cell></Table.Cell>
    </Table.Row>
  );
}
export default function PaymentTransactions() {
  const dispatch = useDispatch<AppDispatch>();
  const { claims } = useSelector(useDashboardSelector);
  const auth = useSelector(useAuthSelector);

  useEffect(() => {
    dispatch(fetchUserClaims({ walletAddress: auth.user.walletAddress }));
  }, [auth]);

  return (
    <div>
      <div className="w-full">
        <Table striped>
          <Table.Head>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Source</Table.HeadCell>
            <Table.HeadCell>Destination Service</Table.HeadCell>
            <Table.HeadCell>Amount</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {claims
              ?.filter((tx: CommonTransaction) => {
                return tx.status === "CREATED";
              })
              .map((tx: CommonTransaction, index: number) => {
                if (tx.type === "PAYMENT_CLAIM") {
                  return ClaimRow(tx, index);
                } else return RedemptionRow(tx, index);
              })}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
