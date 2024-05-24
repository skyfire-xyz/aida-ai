import { useAuthSelector } from "@/src/app/reducers/authentication";
import {
  fetchUserClaims,
  useDashboardSelector,
} from "@/src/app/reducers/dashboardSlice";
import { AppDispatch } from "@/src/store";
import { Badge, Table } from "flowbite-react";
import { useFormatter } from "next-intl";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Claim } from "../../../reducers/types";
import { formatDateString } from "../../../utils";

export default function Claims() {
  const dispatch = useDispatch<AppDispatch>();
  const { claims } = useSelector(useDashboardSelector);
  const auth = useSelector(useAuthSelector);
  const format = useFormatter();

  useEffect(() => {
    dispatch(fetchUserClaims());
  }, [auth]);

  return (
    <div>
      <div className="w-full">
        <Table striped>
          <Table.Head>
            <Table.HeadCell>Type</Table.HeadCell>
            <Table.HeadCell>Sender Name</Table.HeadCell>
            <Table.HeadCell>Receiver Name</Table.HeadCell>
            <Table.HeadCell>Amount</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {claims.map((item: Claim) => (
              <Table.Row
                key={item.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell>
                  <Badge color="purple" className="inline-block">
                    CLAIM
                  </Badge>
                </Table.Cell>
                <Table.Cell>{item.payment.sourceName}</Table.Cell>
                <Table.Cell>{item.payment.destinationName}</Table.Cell>
                <Table.Cell>
                  {(parseFloat(item.payment.value) / 1000000).toFixed(7)} USDC
                </Table.Cell>
                <Table.Cell>{formatDateString(item.createdAt)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
