import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import DialogFundTransfer from "./DialogFundTransfer";
import { BACKEND_API_URL } from "@/src/common/lib/constant";

interface IFormInput {
  service: string;
  description: string;
  website: string;
  price: number;
}

const reservedWallets = {
  Sender: [{ name: "", address: "0x45c83889BD84D5FB77039B67C30695878f506313" }],
  Receiver: [
    { name: "", address: "0x434c55cB06B0a8baa90588eA9eC94985069AaF51" },
    { name: "Joke", address: "0xB94dD221ef1302576E2785dAFB4Bad28cbBeA540" },
    { name: "ChatGPT", address: "0x7aA161F8B72eDd5e474943c922D1e479475B9D30" },
    { name: "Dataset", address: "0xB23338A0F7999e322a504915590ca6A2f0fB2d90" },
    {
      name: "Perplexity",
      address: "0x4E3E0feD99e56d29492e44C176faB18B20aCCC57",
    },
  ],
};

const walletTypes = [
  // 'Minting',
  // 'Acquisition',
  // 'Funding',
  // 'Payment',
  "Sender",
  "Receiver",
  // 'Deployment',
] as const;

/**
 * @pattern ^[a-zA-Z0-9_]+$
 * @format network
 */
export type WalletType = (typeof walletTypes)[number];

export default function WalletManager() {
  const [walletType, setWalletType] = useState<WalletType>("Receiver");
  const [wallets, setWallets] = useState([]);
  const [openError, setOpenError] = useState("");
  const [openSuccess, setOpenSuccess] = useState("");
  const [openInfo, setOpenInfo] = useState("");
  const [walletAdded, setWalletAdded] = useState(false);
  const [transferFund, setTransferFund] = useState<any>(null);
  const [creatingWallet, setCreatingWallet] = useState(false);

  const walletList = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const getWallets = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_API_URL}v2/wallet?walletType=${walletType}`
      );
      setWallets(response.data.reverse());
      walletList?.current?.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setOpenError("Sorry, the blockchain network is slow right now");
    }
  };

  function setLocalStorage(value: any) {
    try {
      const key = "__storage__ai-demo";
      if (window) {
        window["localStorage"].setItem(key, JSON.stringify(value));
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setOpenInfo("Creating wallet...");
    setCreatingWallet(true);
    try {
      const response = await axios.post(`${BACKEND_API_URL}v2/wallet`, {
        price: Number(data.price) * 1000000,
        serviceName: data.service,
        description: data.description,
        website: data.website,
      });
      setLocalStorage({
        ...data,
        price: Number(data.price) * 1000000,
      });
      setWalletAdded(true);
      setOpenInfo("");
      setCreatingWallet(false);
      setTimeout(() => {
        setWalletAdded(false);
      }, 3000);
      setOpenSuccess("Successfully created wallet");
      getWallets();
    } catch {
      setOpenInfo("");
      setCreatingWallet(false);
      setOpenError(
        "Sorry, the blockchain network is slow right now, please try again"
      );
    }
  };

  useEffect(() => {
    getWallets();
  }, [walletType]);

  return (
    <>
      <div className="flex flex-col p-20 md:min-w-[640px] min-w-auto">
        <div className="w-full max-w-lg">
          <Typography variant="h3">Wallet List</Typography>
        </div>
        <div className="mt-5">
          <FormControl fullWidth>
            <Select
              size="small"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={walletType}
              label="Wallet Type"
              onChange={(e) => {
                setWalletType(e.target.value as WalletType);
              }}
            >
              {walletTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div ref={walletList} className="mt-8 overflow-scroll">
          {!wallets.length && <Typography>No wallets found</Typography>}
          {wallets.map((wallet: any, index) => {
            const reservedWalletInfo = reservedWallets[walletType].find((w) => {
              return w.address === wallet.address;
            });

            return (
              <Card
                key={index}
                sx={{ maxWidth: 700 }}
                className={`mb-4 ${
                  walletAdded
                    ? "first:bg-[rgb(229,246,253)]"
                    : "first:bg-[#ffffff]"
                } transition-all`}
              >
                <CardContent>
                  <div className="whitespace-nowrap">
                    <AccountBalanceWalletIcon className="mr-2" />
                    <b>
                      <Link
                        href={`https://mumbai.polygonscan.com/address/${wallet.address}#tokentxns`}
                      >
                        {wallet.address}
                      </Link>
                    </b>
                  </div>
                  {reservedWalletInfo?.name && (
                    <div>
                      <b>Name: </b>
                      {reservedWalletInfo.name}
                    </div>
                  )}
                  <div>
                    <b>Network: </b>
                    {wallet.network}
                  </div>
                  <div>
                    <b>Created At: </b>
                    {wallet.createdAt}
                  </div>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    startIcon={<SendIcon />}
                    onClick={() => {
                      setTransferFund(wallet);
                    }}
                  >
                    Transfer Fund
                  </Button>
                  {!reservedWalletInfo && (
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                    >
                      Delete
                    </Button>
                  )}
                </CardActions>
              </Card>
            );
          })}

          <DialogFundTransfer
            transferFund={transferFund}
            onClose={() => setTransferFund(null)}
            setOpenError={setOpenError}
            setOpenSuccess={setOpenSuccess}
            setOpenInfo={setOpenInfo}
          />
        </div>
      </div>

      <div className="w-full flex flex-col justify-between h-full p-20">
        <Snackbar
          open={!!openInfo}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          onClose={() => setOpenInfo("")}
        >
          <Alert
            onClose={() => setOpenInfo("")}
            severity="info"
            variant="filled"
            sx={{ width: "100%" }}
          >
            <div dangerouslySetInnerHTML={{ __html: openInfo }} />
          </Alert>
        </Snackbar>
        <Snackbar
          open={!!openSuccess}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={5000}
          onClose={() => {
            setOpenSuccess("");
          }}
        >
          <Alert
            onClose={() => {
              setOpenSuccess("");
            }}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            <div dangerouslySetInnerHTML={{ __html: openSuccess }} />
          </Alert>
        </Snackbar>
        <Snackbar
          open={!!openError}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={5000}
          onClose={() => {
            setOpenError("");
          }}
        >
          <Alert
            onClose={() => {
              setOpenError("");
            }}
            severity="error"
            variant="filled"
            sx={{ width: "100%" }}
          >
            <div dangerouslySetInnerHTML={{ __html: openError }} />
          </Alert>
        </Snackbar>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
          <Typography variant="h3">Create a wallet</Typography>
          <div className="flex flex-wrap -mx-3 mb-6 mt-4">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="service"
              >
                Service Name
              </label>
              <input
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                  errors.service ? "border-red-500" : ""
                } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white`}
                type="text"
                placeholder="Enter name of serive"
                {...register("service", {
                  required: true,
                })}
              />
              {errors.service && (
                <p className="text-red-500 text-xs italic mt-2">
                  {errors.service?.type === "required" &&
                    "Service Name is required"}
                </p>
              )}
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="website"
              >
                Website
              </label>
              <input
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border  ${
                  errors.website ? "border-red-500" : ""
                } border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                type="text"
                placeholder="Website URL"
                {...register("website")}
              />
              {errors.website && (
                <p className="text-red-500 text-xs italic mt-2">
                  {errors.website?.type === "required" && "Field is required"}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border  ${
                  errors.description ? "border-red-500" : ""
                } border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                placeholder="Description"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-red-500 text-xs italic mt-2">
                  {errors.description?.type === "required" &&
                    "Field is required"}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-10">
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="price"
              >
                Price
              </label>
              <input
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border  ${
                  errors.description ? "border-red-500" : ""
                } border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                type="number"
                placeholder="Price in USDC"
                step="any"
                {...register("price", { required: true })}
              />
              {errors.price && (
                <p className="text-red-500 text-xs italic mt-2">
                  {errors.price?.type === "required" && "Price is required"}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="contained"
            type="submit"
            color="primary"
            disabled={!!creatingWallet}
          >
            Publish
          </Button>
        </form>
      </div>
    </>
  );
}
