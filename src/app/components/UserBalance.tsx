'use client'

import { useFormatter } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserBalance,
  useAuthSelector,
  userBalanceSelector,
} from "../reducers/authentication";
import { AppDispatch } from "@/src/store";
import { useEffect } from "react";
import { Badge } from "flowbite-react";

function UserBalance() {
  const dispatch = useDispatch<AppDispatch>();
  const format = useFormatter();
  const auth = useSelector(useAuthSelector);
  const userBalance = useSelector(userBalanceSelector);

  useEffect(() => {
    if (
      (!userBalance && auth.user && !auth.status["getUserBalance"]) ||
      auth.status["getUserBalance"] === "idle"
    ) {
      dispatch(getUserBalance());
    }
  }, [userBalance, auth]);

  return (
    <>
      {userBalance && (
        <div className=" inline-block">
          <Badge>
            {format.number(
              Number((userBalance.escrow?.available || 0) / 1000000),
              {
                style: "currency",
                currency: "USD",
              },
            )}
          </Badge>
        </div>
      )}
    </>
  );
}

export default UserBalance;
