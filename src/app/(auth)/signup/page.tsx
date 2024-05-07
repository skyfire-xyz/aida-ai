"use client";

import { AppDispatch } from "@/src/store";
import {
  Button,
  Card,
  Checkbox,
  Label,
  Select,
  Spinner,
  TextInput,
} from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type FC } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useDashboardSelector } from "../../reducers/dashboardSlice";
import {
  createReceiverWallet,
  createSenderWallet,
  useAuthSelector,
} from "../../reducers/authentication";

interface SignupFormInput {
  username: string;
  password: string;
  // acceptTerms: boolean;
  walletType: "receiver" | "sender";
}

const SignUpPage: FC = function () {
  const router = useRouter();
  const { status } = useSelector(useAuthSelector);
  const isPending = status["createSenderWallet"] === "pending";
  const dispatch = useDispatch<AppDispatch>();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInput>({
    defaultValues: {
      walletType: "sender",
    },
  });

  const onSubmit: SubmitHandler<SignupFormInput> = async (data) => {
    if (data.walletType === "sender") {
      dispatch(createSenderWallet({ data }));
    } else {
      dispatch(createReceiverWallet({ data }));
    }
  };

  useEffect(() => {
    if (status["createSenderWallet"] === "succeeded") {
      router.push("/dashboard");
    }
  }, [status]);

  return (
    <div>
      <form
        className="mt-3 space-y-2 p-2 md:space-y-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col items-center justify-center px-6 lg:h-screen">
          <div className="flex items-center gap-x-1 lg:my-0">
            <img src="/images/logo.svg" width="400" className="mr-3" />
          </div>
          <Card
            horizontal
            imgAlt=""
            className="w-full md:max-w-screen-sm md:[&>*]:w-full"
          >
            <h1 className="mb-3 text-2xl font-bold dark:text-white md:text-3xl">
              Sign Up
            </h1>
            <div className="flex flex-col gap-y-3">
              <Label htmlFor="username">Your username</Label>
              <TextInput
                disabled={isPending}
                id="username"
                placeholder="Username"
                type="text"
                {...register("username", {
                  required: true,
                })}
              />
            </div>
            <div className="flex flex-col gap-y-3">
              <Label htmlFor="password">Your password</Label>
              <TextInput
                disabled={isPending}
                id="password"
                placeholder="••••••••"
                type="password"
                {...register("password")}
              />
            </div>
            <div>
              <Label htmlFor="password">Account Type</Label>
              <Controller
                {...register("walletType", { required: true })}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    id="walletType"
                    onChange={(e) => onChange(e.target.value)}
                  >
                    <option value="sender">Service User</option>
                    <option value="receiver">Service Provider</option>
                  </Select>
                )}
              ></Controller>
            </div>
            {/* {errors.currency && (
              <p className="mt-2 text-xs italic text-red-500">
                {errors.currency?.type === "required" && "Currency is required"}
              </p>
            )} */}
            {/* <div className="mb-6 flex items-center gap-x-3">
              <Controller
                {...register("acceptTerms", { required: true })}
                control={control}
                disabled={isPending}
                render={({ field: { onChange, value } }) => (
                  <>
                    <Label htmlFor="acceptTerms">
                      <Checkbox
                        disabled={isPending}
                        id="acceptTerms"
                        name="acceptTerms"
                        className="mr-2"
                        onChange={onChange}
                      />
                      I accept the Terms and Conditions
                    </Label>
                  </>
                )}
              ></Controller>
            </div> */}
            <div className="mb-7">
              {isPending ? (
                <Button
                  type="submit"
                  className="mx-auto flex w-full items-center lg:w-auto"
                  disabled
                >
                  <Spinner size="sm" className="mb-1 mr-2" />
                  Creating user
                </Button>
              ) : (
                <Button type="submit" className="mx-auto w-full lg:w-auto">
                  Create user
                </Button>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Already have an account?&nbsp;
              <a
                href={"#"}
                onClick={() => {
                  router.push("/signin");
                }}
                className="text-primary-600 dark:text-primary-200"
              >
                Login here
              </a>
            </p>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default SignUpPage;
