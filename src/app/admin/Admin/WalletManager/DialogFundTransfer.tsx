"use client";

import { Controller, SubmitHandler, useForm } from "react-hook-form";

import axios from "axios";
import Link from "next/link";
import { BACKEND_API_URL } from "@/src/common/lib/constant";
import { Button, Modal, Radio, Select } from "flowbite-react";

interface TransferFundFormInput {
  address: string;
  amount: string;
  currency: string;
}

export default function DialogFundTransfer({
  transferFund,
  onClose,
  setOpenError,
  setOpenInfo,
  setOpenSuccess,
}: any) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TransferFundFormInput>({
    defaultValues: {
      currency: "USDC",
    },
  });

  const onSubmit: SubmitHandler<TransferFundFormInput> = async (data) => {
    try {
      setOpenInfo("Transferring fund...");
      const response = await axios.post(
        `${BACKEND_API_URL}v2/wallet/transfer`,
        {
          sourceAddress: transferFund?.address,
          destinationAddress: data.address,
          amount: data.amount,
          currency: data.currency,
        }
      );
      setOpenInfo("");
      setOpenSuccess(
        "Successfully requested fund transfer. <br />Your fund will be transferred in a few minutes."
      );
      setTimeout(() => {
        setOpenSuccess("");
      }, 5000);
      onClose();
    } catch {
      setOpenError("Sorry, something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Modal show={transferFund} onClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          <Modal.Header>
            <Link href="https://mumbai.polygonscan.com/address/0x45c83889BD84D5FB77039B67C30695878f506313#tokentxns">
              Transfer Fund
            </Link>
          </Modal.Header>
          <Modal.Body>
            Transfer fund from <b>{transferFund?.address}</b>
            <div className="w-full mt-5">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="service"
              >
                To
              </label>
              <input
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                  errors.address ? "border-red-500" : ""
                } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`}
                type="text"
                placeholder="Wallet Address"
                {...register("address", {
                  required: true,
                })}
              />
              {errors.address && (
                <p className="text-red-500 text-xs italic mt-2">
                  {errors.address?.type === "required" && "Address is required"}
                </p>
              )}
            </div>
            <div className="w-full mt-5">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold"
                htmlFor="price"
              >
                Currency
              </label>
              <Controller
                {...register("currency", { required: true })}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select id="currency">
                    <option value="USDC">USDC</option>
                    <option value="MATIC">MATIC</option>
                  </Select>
                )}
              ></Controller>
              {errors.currency && (
                <p className="text-red-500 text-xs italic mt-2">
                  {errors.currency?.type === "required" &&
                    "Currency is required"}
                </p>
              )}
            </div>
            <div className="w-full mt-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="price"
              >
                Amount
              </label>
              <input
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border  ${
                  errors.amount ? "border-red-500" : ""
                } border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                type="number"
                placeholder="Amount in selected currency"
                step="any"
                {...register("amount", { required: true })}
              />
              {errors.amount && (
                <p className="text-red-500 text-xs italic mt-2">
                  {errors.amount?.type === "required" && "Amount is required"}
                </p>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">Send</Button>
            <Button color="light" onClick={onClose}>
              Cancel
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
