import { Table } from "flowbite-react";
import demoTranasctions from "./test.json";
import axios from "axios";
import { BACKEND_API_URL } from "@/src/common/lib/constant";
import { useEffect } from "react";

export default function PaymentTransactions() {
  const getAllTransactions = async () => {
    try {
      const response = await axios.get(`${BACKEND_API_URL}v2/transactions`);
      console.log(response.data);
    } catch {
      //   setOpenError("Sorry, the blockchain network is slow right now");
    }
  };

  const getAddressTransactions = async (address: string) => {
    try {
      const response = await axios.get(
        `${BACKEND_API_URL}v2/transactions/${address}`
      );
    } catch {
      //   setOpenError("Sorry, the blockchain network is slow right now");
    }
  };
  useEffect(() => {
    getAllTransactions();
  }, []);

  console.log(demoTranasctions);

  return (
    <div className="mt-20">
      <div className="w-full">
        <h3 className="text-3xl">Payment Transactions</h3>
      </div>
      <div className="w-full mt-10">
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
            {demoTranasctions
              .filter((tx) => {
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
