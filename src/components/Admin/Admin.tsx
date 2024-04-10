import React, { useEffect, useState } from "react";
import router from "next/router";

import { AdminManageListData } from '../table.type';
import { supabase } from "../Supabase/client";
import AdminManageList from "../UI/AdminManageList";


const Admin: React.FC = () => {
  const [data, setData] = useState<AdminManageListData[]>([]);
  const [checkedState, setCheckedState] = useState<boolean[]>(new Array(data.length).fill(false));


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const { data: adminManageData, error } = await supabase
        .from('user_table')
        .select('*')
        .eq('complete_stage', 6)
        .order('created_at', { ascending: false }); // Fetch data in descending order based on createDate
      if (adminManageData) {
        setData(adminManageData);
        setCheckedState(new Array(adminManageData.length).fill(false));
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

  const handleCheckChange = (updatedCheckedState: boolean[]) => {
    setCheckedState(updatedCheckedState);
  };

  const handleProfile = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    router.push('/adminupdate');
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
            プロフィールの更新
          </button>
        </div>
        <p className=" m-5 text-[30px] flex justify-center mb-5">
          【スマートソーラー管理画面】
        </p>
        <div className="mt-10 sm:mx-10">
          <AdminManageList
            data={data}
            checkedState={checkedState}
            onCheckChange={handleCheckChange} />
        </div>
        {/* </div> */}
      </div>
  );
};

export default Admin;

