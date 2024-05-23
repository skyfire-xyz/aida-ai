import { useAuthSelector } from "@/src/app/reducers/authentication";
import {
  fetchReceivers,
  useDashboardSelector,
} from "@/src/app/reducers/dashboardSlice";
import { AppDispatch } from "@/src/store";
import { Table } from "flowbite-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Receiver } from "../../../reducers/types";
import { useFormatter } from "next-intl";

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
            <Table.HeadCell>Currency</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {receivers.map((item: Receiver) => (
              <Table.Row
                key={item.skyfireUser.username}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell>{item.skyfireUser.username}</Table.Cell>
                <Table.Cell>
                  {format.number(Number(item.cost / 1000000), {
                    style: "decimal",
                  })}
                </Table.Cell>
                <Table.Cell>{item.currency}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
