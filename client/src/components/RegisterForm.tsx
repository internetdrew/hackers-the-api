import axios, { AxiosError } from "axios";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";
import * as z from "zod";

import "../index.css";

type RegistrationInputs = {
  username: string;
  password: string;
  passwordConfirmation: string;
};

const registerUserSchema = z
  .object({
    username: z.string().min(3, { message: "Please enter a username." }),
    password: z.string().min(1, { message: "Please enter a password." }),
    passwordConfirmation: z.string().min(1, {
      message: "Please confirm your password.",
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match.",
    path: ["passwordConfirmation"],
  });

const RegisterForm = ({
  setActiveForm,
}: {
  setActiveForm: React.Dispatch<React.SetStateAction<"register" | "login">>;
}) => {
  const { mutate } = useSWRConfig();
  const [errorOnPost, setErrorOnPost] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<RegistrationInputs>({
    resolver: zodResolver(registerUserSchema),
  });

  const onSubmit: SubmitHandler<RegistrationInputs> = async (data) => {
    try {
      await axios.post(
        `${import.meta.env.PUBLIC_API_URL}/user`,
        {
          username: data.username,
          password: data.password,
        },
        {
          withCredentials: true,
        },
      );
      setErrorOnPost(false);
      mutate(`${import.meta.env.PUBLIC_API_URL}/check-auth`);
    } catch (error) {
      setErrorOnPost(true);
      if ((error as AxiosError).response?.status === 409) {
        toast.error("This user already exists. Try another username.");
      }
    }
  };

  useEffect(() => {
    if (!errorOnPost) {
      reset();
    }
  }, [isSubmitSuccessful, errorOnPost]);

  const handleFormSwap = () => setActiveForm("login");

  return (
    <div className="form-container">
      <span className="form-title">Create an account</span>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="formControl">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Enter a username"
            {...register("username")}
            aria-invalid={errors.username ? "true" : "false"}
          />
          {errors.username?.message && <small>{errors.username.message}</small>}
        </div>
        <div className="formControl">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter a password"
            {...register("password")}
            aria-invalid={errors.password ? "true" : "false"}
          />
          {errors.password?.message && <small>{errors.password.message}</small>}
        </div>
        <div className="formControl">
          <label htmlFor="passwordConfirmation">Confirm Password</label>
          <input
            id="passwordConfirmation"
            type="password"
            placeholder="Confirm password"
            {...register("passwordConfirmation")}
            aria-invalid={errors.passwordConfirmation ? "true" : "false"}
          />
          {errors.passwordConfirmation?.message && (
            <small>{errors.passwordConfirmation.message}</small>
          )}
        </div>
        <button type="submit" className="submit-btn">
          Register
        </button>
      </form>
      <small className="or">Already have an account?</small>
      <button onClick={handleFormSwap}>Login</button>
    </div>
  );
};

export default RegisterForm;
