import { useAuthSelector } from "@/src/app/reducers/authentication";
import {
  fetchReceivers,
  useDashboardSelector,
} from "@/src/app/reducers/dashboardSlice";
import { AppDispatch } from "@/src/store";
import { Badge, Table } from "flowbite-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Receiver } from "../../../reducers/types";
import { useFormatter } from "next-intl";
import { formatDateString } from "../../../utils";

export default function Receivers() {
  const dispatch = useDispatch<AppDispatch>();
  const { receivers } = useSelector(useDashboardSelector);
  const auth = useSelector(useAuthSelector);
  const format = useFormatter();

  useEffect(() => {
    dispatch(fetchReceivers());
  }, [auth]);

  return (
    <div>
      <div className="w-full">
        <Table striped>
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Cost</Table.HeadCell>
            <Table.HeadCell>Last Updated</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {receivers.map((item: Receiver) => (
              <Table.Row
                key={item.skyfireUser.username}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell>{item.skyfireUser.username}</Table.Cell>
                <Table.Cell>
                  {(Number(item?.cost) / 1000000).toFixed(7)} USDC
                </Table.Cell>
                <Table.Cell>{formatDateString(item.updatedDate)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
