"use client";

import { Button, Card, Modal, Progress, TextInput } from "flowbite-react";
import { usePathname } from "next/navigation";
import { AiFillBank } from "react-icons/ai";
import { BsCreditCard2Back } from "react-icons/bs";
import { GrBitcoin } from "react-icons/gr";
import { BiTransferAlt } from "react-icons/bi";
import Image from "next/image";
import { defaultImageLoader } from "@/src/common/lib/imageLoaders";
import { IoLogoUsd } from "react-icons/io";
import { useState } from "react";

export default function Wallets(props: { params: { address: string } }) {
  const address = props.params.address;
  const [usd, setUsd] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  return (
    <div>
      <Card className={`mb-4 max-w-md transition-all dark:text-white`}>
        <h3 className="text-sm">Payment method</h3>

        <div className="flex gap-2">
          <Button color="info" aria-selected>
            <div className="flex w-14 flex-col items-center justify-center">
              <AiFillBank className="h-6 w-6" />
              <span>Bank</span>
            </div>
          </Button>

          <Button color="info" disabled>
            <div className="flex w-14 flex-col items-center justify-center">
              <BsCreditCard2Back className="h-6 w-6" />
              <span className="mt-1 whitespace-nowrap text-xs">
                Credit Card
              </span>
            </div>
          </Button>
          <Button color="info" disabled>
            <div className="flex w-14 flex-col items-center justify-center">
              <GrBitcoin className="h-6 w-6" />
              <span>Crypto</span>
            </div>
          </Button>
        </div>

        <div className="mt-6">
          <h3 className="mb-2 text-sm">Amount</h3>
          <span className="mb-1 flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <AiFillBank /> Daily Limit
            </div>
            <div>$8,642 remaining</div>
          </span>
          <Progress size={"sm"} progress={12} />
        </div>

        <div className="flex items-center justify-between gap-2">
          <TextInput
            id="USD"
            step=".01"
            type="number"
            placeholder="USD"
            icon={IoLogoUsd}
            onChange={(e: any) => {
              const num = Number(e.target.value).toFixed(2);
              setUsd(Number(num));
            }}
          />
          <BiTransferAlt className="h-4 w-4" />
          <TextInput
            type="number"
            step=".01"
            icon={() => (
              <Image alt="usdc" width="20" height="20" src="/images/usdc.svg" />
            )}
            disabled
            value={usd === 0 ? "" : Math.round(usd * 0.999)}
            id="usdc"
            placeholder="USDC"
          />
        </div>

        <Button
          disabled={!usd}
          className="mt-6"
          onClick={() => setOpenModal(true)}
        >
          <span>BUY - {usd ? Math.round(usd * 0.999) : ""}</span>
          <Image
            alt="usdc"
            width="20"
            height="20"
            src="/images/usdc.svg"
            className="ml-2 mr-1"
          />
          <span>USDC</span>
        </Button>
      </Card>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Complete Payment</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpenModal(false)}>Confirm</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
