import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

import axios from "axios";
import Link from "next/link";
import { BACKEND_API_URL } from "@/src/common/lib/constant";

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
      setOpenSuccess(
        "Successfully requested fund transfer. <br />Your fund will be transferred in a few minutes."
      );
      setOpenInfo("");
      onClose();
    } catch {
      setOpenError("Sorry, something went wrong. Please try again.");
    }
  };

  return (
    <Dialog
      open={transferFund}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
        <DialogTitle id="alert-dialog-title">
          <Link href="https://mumbai.polygonscan.com/address/0x45c83889BD84D5FB77039B67C30695878f506313#tokentxns">
            Transfer Fund
          </Link>
        </DialogTitle>
        <DialogContent>
          <Typography color="">
            Transfer fund from <b>{transferFund?.address}</b>
          </Typography>
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
            <FormControl>
              <Controller
                {...register("currency", { required: true })}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <RadioGroup
                    row
                    value={value}
                    onChange={onChange}
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel
                      value="USDC"
                      control={<Radio />}
                      label="USDC"
                    />
                    <FormControlLabel
                      value="MATIC"
                      control={<Radio />}
                      label="MATIC"
                    />
                  </RadioGroup>
                )}
              ></Controller>
            </FormControl>
            {errors.currency && (
              <p className="text-red-500 text-xs italic mt-2">
                {errors.currency?.type === "required" && "Currency is required"}
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
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" type="submit">
            Send
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
