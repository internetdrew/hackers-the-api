import axios, { AxiosError } from "axios";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import "../index.css";

type LoginInputs = {
  username: string;
  password: string;
};

const loginUserSchema = z
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

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginUserSchema),
  });
  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    try {
      await axios.post(
        `${import.meta.env.PUBLIC_API_BASE_URL}/user`,
        {
          username: data.username,
          password: data.password,
        },
        { withCredentials: true },
      );
    } catch (error) {
      console.error((error as AxiosError).message);
    }
  };

  return (
    <div className="form-container">
      <span>Login</span>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
