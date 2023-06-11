"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";

const createUserSchema = z
  .object({
    username: z.string().nonempty({ message: "Username is required" }),
    email: z
      .string()
      .nonempty({ message: "Email is required" })
      .email("Not a valid email"),
    password: z
      .string()
      .nonempty({ message: "Password is required" })
      .min(6, "Password to short -should be 6 chars minimum"),
    confirmPassword: z
      .string()
      .nonempty({ message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type CreateUserInput = z.infer<typeof createUserSchema>;

export default function Register() {
  const [registerError, setRegisterError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  const onSubmit: SubmitHandler<CreateUserInput> = async (data) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/users`,
        data
      );
    } catch (e: any) {
      setRegisterError(e.message);
    }
  };

  return (
    <>
      <section className="bg-gray-50">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                Create and account
              </h1>
              <p>{registerError}</p>
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Your username
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                    placeholder="Your name"
                    {...register("username")}
                  />
                  <span className="text-red-800 text-sm block mt-2">
                    {errors.username?.message}
                  </span>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                    placeholder="Ouzaa@example.com"
                    {...register("email")}
                  />
                  <span className="text-red-800 text-sm block mt-2">
                    {errors.email?.message}
                  </span>
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                    placeholder="••••••••"
                    {...register("password")}
                  />
                  <span className="text-red-800 text-sm block mt-2">
                    {errors.password?.message}
                  </span>
                </div>
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Confirm password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                  />
                  <span className="text-red-800 text-sm block mt-2">
                    {errors.confirmPassword?.message}
                  </span>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-25"
                  disabled={isSubmitting}
                >
                  Create an account
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
