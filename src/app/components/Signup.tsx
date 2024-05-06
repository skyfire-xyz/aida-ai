import { Button, Label, Modal, TextInput } from "flowbite-react";
import { use, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/store";
import { setUser, signInUser } from "../reducers/authentication";
import { useRouter } from "next/navigation";

interface LoginFormInput {
  username: string;
  password: string;
}

function SignInForm({ setIsSignup }: { setIsSignup: (bool: boolean) => void }) {
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
    } else {
      dispatch(signInUser(data));
    }
  };

  return (
    <form
      className="mt-3 space-y-2 p-2 md:space-y-3"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <Label htmlFor="username">Username</Label>
        <TextInput
          placeholder="Demo Users: Aida"
          className="w-full rounded-xl bg-[#f7f9fa]"
          {...register("username")}
        ></TextInput>
      </div>
      <div className="mb-4">
        <Label htmlFor="password">Password</Label>
        <TextInput
          type="password"
          {...register("password")}
          placeholder="password"
          className="w-full rounded-xl bg-[#f7f9fa]"
        ></TextInput>
      </div>
      <div className="flex items-center justify-between">
        <a
          href="#"
          className="text-primary-600 dark:text-primary-500 text-sm font-medium hover:underline"
        >
          Forgot password?
        </a>
      </div>
      <Button className="w-full" type="submit">
        Sign In
      </Button>
      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
        Don’t have an account yet?{" "}
        <a
          href="#"
          className="text-primary-600 dark:text-primary-500 font-medium hover:underline"
          onClick={() => {
            router.push("/signup");
          }}
        >
          Sign up
        </a>
      </p>
    </form>
  );
}

function SignUpForm({ setIsSignup }: { setIsSignup: (bool: boolean) => void }) {
  return (
    <form className="space-y-2 p-2 md:space-y-3" action="#">
      <div>
        <Label htmlFor="username">Username</Label>
        <TextInput
          name="username"
          placeholder="Demo Users: Aida"
          className="w-full rounded-xl bg-[#f7f9fa]"
        ></TextInput>
      </div>
      <div className="mb-4">
        <Label htmlFor="password">Password</Label>
        <TextInput
          type="password"
          name="password"
          placeholder="password"
          required
          className="w-full rounded-xl bg-[#f7f9fa]"
        ></TextInput>
      </div>
      <Button className="w-full" type="submit">
        Sign Up
      </Button>
      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
        Do you have an account already?{" "}
        <a
          href="#"
          className="text-primary-600 dark:text-primary-500 font-medium hover:underline"
          onClick={() => setIsSignup(false)}
        >
          Sign in
        </a>
      </p>
    </form>
  );
}

export default function Signup({
  showSignup,
  onClose,
}: {
  showSignup: boolean;
  onClose: () => void;
}) {
  const [isSignup, setIsSignup] = useState(false);
  return (
    <Modal size={"sm"} show={showSignup} onClose={onClose}>
      <Modal.Header>{isSignup ? "Sign Up" : "Log in"}</Modal.Header>
      <Modal.Body>
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={isSignup ? "signup" : "signin"}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <SignInForm setIsSignup={setIsSignup} />
          </motion.div>
        </AnimatePresence>
      </Modal.Body>
    </Modal>
  );
}
