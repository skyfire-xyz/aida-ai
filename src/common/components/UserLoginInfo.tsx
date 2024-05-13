import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserBalance,
  setUser,
  useAuthSelector,
  userBalanceSelector,
} from "../../app/reducers/authentication";
import { AppDispatch } from "@/src/store";
import {
  fetchWallets,
  resetState,
  useDashboardSelector,
} from "@/src/app/reducers/dashboardSlice";
import { use, useEffect } from "react";

function UserLoginInfo() {
  const dispatch = useDispatch<AppDispatch>();
  const format = useFormatter();
  const auth = useSelector(useAuthSelector);
  const userBalance = useSelector(userBalanceSelector);

  useEffect(() => {
    if (!userBalance && auth.user) {
      dispatch(getUserBalance());
    }
  }, [userBalance, auth]);

  return (
    <>
      {auth.user && (
        <div className="text-white">
          <div className="flex items-center">
            <img
              src={auth.user.avatar}
              className="mr-2 h-12 w-12 rounded-full object-cover"
              alt=""
            />
            <div className="text-sm">
              Username: <b>{auth.user.username}</b>
              {userBalance && (
                <p>
                  Balance:{" "}
                  <b>
                    {format.number(
                      Number((userBalance.escrow?.available || 0) / 1000000),
                      {
                        style: "currency",
                        currency: "USD",
                      },
                    )}
                  </b>
                </p>
              )}
            </div>
            <Link
              className="ml-4 flex items-center"
              href={"#"}
              onClick={() => {
                dispatch(setUser({}));
                dispatch(resetState());
              }}
            >
              <span className="ml-1 text-xs">Log out</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default UserLoginInfo;
