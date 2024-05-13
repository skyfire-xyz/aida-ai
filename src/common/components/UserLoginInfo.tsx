import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setUser, useAuthSelector } from "../../app/reducers/authentication";
import { AppDispatch } from "@/src/store";
import { resetState } from "@/src/app/reducers/dashboardSlice";
import UserBalance from "./UserBalance";

function UserLoginInfo() {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector(useAuthSelector);

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
            <div>
              <div className="text-sm">
                <b>{auth.user.username}</b>
              </div>
              <UserBalance />
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
