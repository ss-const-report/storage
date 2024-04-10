import React, { useEffect, useState } from "react";
import router from "next/router";
import { v4 as uuidv4 } from 'uuid';

import { supabase } from "../Supabase/client";
import IndividualManageListTable from "../UI/IndividualManageList";
import { IndividualManageListData } from '../table.type';
import Link from "next/link";
import ContactInfo from "../ContactInfo";

const Home: React.FC = () => {
  const [data, setData] = useState<IndividualManageListData[]>([]);

  const [companyName, SetCompanyName] = useState<string>('');
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      const userID = user?.id;
      const { data: individualManageData, error } = await supabase
        .from('user_table')
        .select('*')
        .order('created_at', { ascending: false }) // Fetch data in descending order based on createDate
        .eq('user_id', userID);
      if (individualManageData) {
        setData(individualManageData);
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profile')
        .select('*')
        .eq('user_id', userID)
        .single();

      if (profileData) {
        SetCompanyName(profileData.company_name);
      }
      setIsLoading(false);
      if (error) {
        setIsLoading(false);
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const loginCheck = localStorage.getItem("userToken");

    if (!loginCheck) {
      router.push("/");
    }
  }, []);

  const [isLoading, setIsLoading] = useState(false);



  const handleRegister = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (localStorage.getItem('myUUID'))
      localStorage.removeItem('myUUID');
    localStorage.setItem('myUUID', uuidv4());
    router.push('/register/regbasicinfo');
  };

  const handleProfile = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    router.push('/profileupdate');
  };


  return (
    isLoading ?
      <>読み込み中...</> :
      <div className="m-10">
        <div className="flex justify-end">
          <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 
                                         focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2"
            onClick={handleProfile}
          >
            プロフィールの登録と更新
          </button>
        </div>
        <p className=" m-5 text-[30px] flex justify-center mb-5">
          【{companyName} 管理画面】
        </p>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleRegister}
        >
          新しく作成
        </button>
        <div className="flex justify-end">
          <Link
            className="text-blue-500 text-[20px] font-thin leading-[51px] block fill-slate-400 mx-4 underline"
            href="https://www.smartsolar.co.jp/business/sh/construction"
            target="_blank"
            rel="noopener noreferrer"
          >
            施工店様向け施工説明書等ダウンロード
          </Link>
          <Link
            className="text-blue-500 text-[20px] font-thin leading-[51px] block fill-slate-400 mx-4 underline"
            href="https://www.smartsolar.co.jp/business/sh/construction2"
            target="_blank"
            rel="noopener noreferrer"
          >
            施工店の電力施工等ダウンロード
          </Link>
        </div>

        <div className="mt-10 sm: mx-20">
          <IndividualManageListTable data={data} />
        </div>
        <div className="flex justify-end m-5 mt-10">
          <ContactInfo />
        </div>
      </div>
  );
};

export default Home;

