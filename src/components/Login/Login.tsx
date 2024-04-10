import Link from "next/link";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import router from "next/router";

import { supabase } from "../Supabase/client";


interface FormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    const loginCheck = localStorage.getItem("userToken");

    if (loginCheck) {
      router.push("/home");
    }
  }, [router]);

  const loginHandler = async (formData: any, e: any) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;
      localStorage.setItem("userToken", JSON.stringify(data));
      toast.success("Login successful");
      router.push("/home");
    } catch (error) {
      toast.error("Invalid login credentials");
    }
  };

  return (
    <div className="flex justify-center items-center sm:h-screen ">
      <form
        onSubmit={handleSubmit(loginHandler)}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-10 mb-4 w-5/6 lg:w-1/2"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Eメール
          </label>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{
              required: "Eメールアドレスを入力してください",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "無効なメールアドレス",
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none 
                            focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Eメール"
              />
            )}
          />
          {errors.email && (
            <div className="block mt-1 text-red-400 invalid-feedback">
              <p>{errors.email.message}</p>
            </div>
          )}
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            パスワード
          </label>
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{
              required: "パスワードを入力してください",
            }}
            render={({ field }) => (
              <input
                {...field}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none
                            focus:shadow-outline"
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="パスワード"
              />
            )}
          />
          {errors.password && (
            <div className="block mt-1 text-red-400 invalid-feedback">
              <p>{errors.password.message}</p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mb-6">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            サインイン
          </button>
        </div>
        <div className="flex items-center justify-between">
          <p>
            アカウントをお持ちでない場合は、{" "}
            <Link className="text-blue-500" href="/signup">
              {" "}
              サインアップ{" "}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
