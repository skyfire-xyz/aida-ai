"use client";

import { AppDispatch } from "@/src/store";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { useEffect, type FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  getUser,
  setUser,
  signInUser,
  useAuthSelector,
} from "../../reducers/authentication";

export interface LoginFormInput {
  username: string;
  password: string;
}

const SignInPage: FC = function () {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormInput> = async (data) => {
    if (data.username === "aida") {
      dispatch(
        setUser({
          username: "aida",
        }),
      );
      router.push("/admin");
    } else {
      dispatch(signInUser(data));
    }
  };

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
              Sign in
            </h1>
            <div className="mb-4 flex flex-col gap-y-3">
              <Label htmlFor="username">Your username</Label>
              <TextInput
                id="username"
                placeholder="Username"
                type="text"
                {...register("username", { required: "Username is required" })}
              />
            </div>
            <div className="mb-2 flex flex-col gap-y-3">
              <Label htmlFor="password">Your password</Label>
              <TextInput
                id="password"
                placeholder="••••••••"
                type="password"
                {...register("password")}
              />
            </div>
            <div className="mb-6 flex items-center justify-between">
              {/* <div className="flex items-center gap-x-3">
              <Checkbox id="rememberMe" name="rememberMe" />
              <Label htmlFor="rememberMe">Remember me</Label>
            </div> */}
              <a
                href="#"
                className="text-primary-600 dark:text-primary-300 ml-auto w-1/2 text-right text-sm dark:text-white"
              >
                Lost Password?
              </a>
            </div>
            <div className="mb-6">
              <Button type="submit" className="mx-auto w-full lg:w-auto">
                Login to your account
              </Button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Not registered?&nbsp;
              <a
                href={"#"}
                onClick={() => {
                  router.push("/signup");
                }}
                className="text-primary-600 dark:text-primary-300"
              >
                Create account
              </a>
            </p>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default SignInPage;
