import Link from "next/link";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import router from "next/router";

import { supabase } from "../Supabase/client";

interface FormData {
  company_name: string;
  address: string;
  phone_number: string;
  construction_id: string;
  owner_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

const Signup: React.FC = () => {
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<FormData>();


  useEffect(() => {
    const loginCheck = localStorage.getItem("userToken");

    if (loginCheck) {
      router.push("/home");
    }
  }, [router]);

  const signupHandler = async (formData: any, e: any) => {
    e.preventDefault();

    try {
      console.log(formData.email);
      console.log(formData.password);
      console.log(formData.company_name)

      const { data: user, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.company_name,
          },
        },
      });
      if (error) throw error;

      console.log(user.user?.id)
      const updates = {
        user_id: user.user?.id,
        company_name: formData.company_name,
        email: formData.email,
        address: formData.address,
        phone_number: formData.phone_number,
        construction_id: formData.construction_id,
        owner_name: formData.owner_name,
        updated_at: new Date(),
      };

      console.log('before saving in profile table');
      console.log(updates);

      // Upsert user profile data into the 'profile' table
      const { data: profileData, error: profileError } = await supabase
        .from('profile')
        .upsert(updates, {
          onConflict: 'user_id',
        })

      if (profileError) {
        console.log(profileError);
        toast.error("Profile update failed");
        return;
      }

      const passwordUpdate = {
        user_id: user.user?.id,
        password: process.env.NEXT_PUBLIC_PROTECTED_PAGE_CONFIG,
      };
      console.log("passwordUpdate", passwordUpdate);
      const { data: settingData, error: settingError } = await supabase
        .from('setting')
        .upsert(passwordUpdate, {
          onConflict: 'user_id',
        });

        if (settingError) {
          console.log(settingError);
          toast.error("Profile update failed");
          return;
        }

      console.log('after saving in profile table');

      toast.success("Check your email for verification link");
      router.push("/");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit(signupHandler)}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-5/6 lg:w-1/2"
      >
        {/* company name */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="company_name"
          >
            名前
          </label>
          <Controller
            name="company_name"
            control={control}
            defaultValue=""
            rules={{
              required: "会社名を入力してください",
            }}
            render={({ field }) => (
              <input
                {...field}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none
                            focus:shadow-outline"
                id="company_name"
                type="text"
                placeholder="会社名"
              />
            )}
          />
          {errors.company_name && (
            <div className="block mt-1 text-red-400 invalid-feedback">
              <p>{errors.company_name.message}</p>
            </div>
          )}
        </div>
        {/* Address */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="address"
          >
            住所
          </label>
          <Controller
            name="address"
            control={control}
            defaultValue=""
            rules={{
              required: "住所を入力してください",
            }}
            render={({ field }) => (
              <input
                {...field}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none
                            focus:shadow-outline"
                id="address"
                type="text"
                placeholder="住所"
              />
            )}
          />
          {errors.address && (
            <div className="block mt-1 text-red-400 invalid-feedback">
              <p>{errors.address.message}</p>
            </div>
          )}
        </div>
        {/* Phone Number */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="phone_number"
          >
            電話番号
          </label>
          <Controller
            name="phone_number"
            control={control}
            defaultValue=""
            rules={{
              required: "電話番号を入力してください",
            }}
            render={({ field }) => (
              <input
                {...field}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none
                            focus:shadow-outline"
                id="phone_number"
                type="text"
                placeholder="電話番号"
              />
            )}
          />
          {errors.phone_number && (
            <div className="block mt-1 text-red-400 invalid-feedback">
              <p>{errors.phone_number.message}</p>
            </div>
          )}
        </div>

        {/* Construct ID */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="construction_id"
          >
            施工ID認定番号
          </label>
          <Controller
            name="construction_id"
            control={control}
            defaultValue=""
            rules={{
              required: "施工ID認定番号を入力してください",
            }}
            render={({ field }) => (
              <input
                {...field}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none
                            focus:shadow-outline"
                id="construction_id"
                type="text"
                placeholder="施工ID認定番号"
              />
            )}
          />
          {errors.construction_id && (
            <div className="block mt-1 text-red-400 invalid-feedback">
              <p>{errors.construction_id.message}</p>
            </div>
          )}
        </div>

        {/* Owner Name */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="owner_name"
          >
            施工IDカード所持者氏名
          </label>
          <Controller
            name="owner_name"
            control={control}
            defaultValue=""
            rules={{
              required: "施工IDカード所持者氏名を入力してください",
            }}
            render={({ field }) => (
              <input
                {...field}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none
                            focus:shadow-outline"
                id="owner_name"
                type="text"
                placeholder="施工IDカード所持者氏名"
              />
            )}
          />
          {errors.owner_name && (
            <div className="block mt-1 text-red-400 invalid-feedback">
              <p>{errors.owner_name.message}</p>
            </div>
          )}
        </div>

        {/* Email */}
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
              required: "Eメールを入力してください",
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

        {/* Pawword */}

        <div className="mb-4">
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
              minLength: {
                value: 6,
                message: "少なくとも6文字を入力してください",
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none
                            focus:shadow-outline"
                id="password"
                autoComplete="new-password"
                type="password"
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

        {/* Confirm Password */}
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="confirmPassword"
          >
            確認用のパスワード
          </label>
          <Controller
            name="confirm_password"
            control={control}
            defaultValue=""
            rules={{
              required: "確認用のパスワードを入力してください",
              validate: (value) => {
                const { password } = getValues();
                return password === value || "パスワードは一致する必要があります";
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="password"
                autoComplete="new-password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none
                            focus:shadow-outline"
                id="confirmPassword"
                placeholder="確認用のパスワード"
              />
            )}
          />
          {errors.confirm_password && (
            <div className="block mt-1 text-red-400 invalid-feedback">
              <p>{errors.confirm_password.message}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-6">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none
                         focus:shadow-outline"
            type="submit"
          >
            サインアップ
          </button>
        </div>
        <div className="flex items-center justify-between">
          <p>
          すでにアカウントをお持ちですか？
            <Link className="text-blue-500" href="/">
              {" "}
              サインイン
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
