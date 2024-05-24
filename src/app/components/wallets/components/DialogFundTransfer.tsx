"use client";

import { Controller, SubmitHandler, useForm } from "react-hook-form";

import axios from "axios";
import Link from "next/link";
import { BACKEND_API_URL } from "@/src/common/lib/constant";
import { Button, Modal, Radio, Select } from "flowbite-react";
import { AppDispatch } from "@/src/store";
import { useDispatch, useSelector } from "react-redux";
import {
  transferFund,
  useDashboardSelector,
} from "@/src/app/reducers/dashboardSlice";
import { useEffect } from "react";

interface TransferFundFormInput {
  address: string;
  amount: string;
  currency: string;
}

export default function DialogFundTransfer({ transferFundObj, onClose }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector(useDashboardSelector);
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

  useEffect(() => {
    if (
      status["transferFund"] === "succeeded" ||
      status["transferFund"] === "failed"
    ) {
      onClose();
    }
  }, [status]);

  const onSubmit: SubmitHandler<TransferFundFormInput> = async (data) => {
    try {
      dispatch(
        transferFund({ ...data, sourceAddress: transferFundObj?.address }),
      );
    } catch {}
  };

  return (
    <>
      <Modal show={transferFundObj} onClose={onClose}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-3 dark:text-white"
        >
          <Modal.Header>
            <Link href="https://www.oklink.com/amoy/address/0x45c83889BD84D5FB77039B67C30695878f506313/token-transfer">
              Transfer Fund
            </Link>
          </Modal.Header>
          <Modal.Body>
            Transfer fund from <b>{transferFundObj?.address}</b>
            <div className="mt-5 w-full">
              <label
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                htmlFor="service"
              >
                To
              </label>
              <input
                className={`block w-full appearance-none border bg-gray-200 text-gray-700 ${
                  errors.address ? "border-red-500" : ""
                } rounded px-4 py-3 leading-tight focus:bg-white focus:outline-none`}
                type="text"
                placeholder="Wallet Address"
                {...register("address", {
                  required: true,
                })}
              />
              {errors.address && (
                <p className="mt-2 text-xs italic text-red-500">
                  {errors.address?.type === "required" && "Address is required"}
                </p>
              )}
            </div>
            <div className="mt-5 w-full">
              <label
                className="block text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-white"
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
                <p className="mt-2 text-xs italic text-red-500">
                  {errors.currency?.type === "required" &&
                    "Currency is required"}
                </p>
              )}
            </div>
            <div className="mt-3 w-full">
              <label
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-white"
                htmlFor="price"
              >
                Amount
              </label>
              <input
                className={`block w-full appearance-none border bg-gray-200 text-gray-700  ${
                  errors.amount ? "border-red-500" : ""
                } rounded border-gray-200 px-4 py-3 leading-tight focus:border-gray-500 focus:bg-white focus:outline-none`}
                type="number"
                placeholder="Amount in selected currency"
                step="any"
                {...register("amount", { required: true })}
              />
              {errors.amount && (
                <p className="mt-2 text-xs italic text-red-500">
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