import React, { useEffect, useState } from 'react';
import router from 'next/router';

import { IndividualManageListData } from '../table.type';
import { formatDate } from '../util';
import { supabase } from "@/components/Supabase/client";

interface TableProps {
    data: IndividualManageListData[];
}

interface OrderDirection {
    [key: string]: 'asc' | 'desc' | undefined;
}

// Table component
const IndividualManageList: React.FC<TableProps> = ({ data }) => {

    const [memos, setMemos] = useState(data.map(item => ({ id: item.report_id, memo: item.memo })));

    // Function to update memo in state
    const handleMemoChange = (reportId: string | undefined, newMemo: any) => {
        setMemos(memos.map(memo => memo.id === reportId ? { ...memo, memo: newMemo } : memo));
    };

    const updateUserTable = async (reportId: string | undefined, newMemo: string | undefined) => {
        try {
            await supabase
                .from('user_table') // Replace with your actual table name
                .update({ memo: newMemo })
                .eq('report_id', reportId);
            console.log("Update successful.");
        } catch (err) {
            console.error("Error in update:", err);
        }
    };

    const handleEditClick = async (reportId: any) => {
        localStorage.setItem('myUUID', reportId);
        router.push('/register/regbasicinfo');
    };

    const [sortedData, setSortedData] = useState(data);
    const [orderDirection, setOrderDirection] = useState<OrderDirection>({});
    const [filterProgress, setFilterProgress] = useState('');

    useEffect(() => {
        setSortedData(data); // Update sortedData when data prop changes
    }, [data]);


    const sortData = (columnName: string) => {
        const direction = orderDirection[columnName] === 'asc' ? 'desc' : 'asc';
        const sorted = [...data].sort((a, b) => {
            if (columnName === 'お客様名') {
                // Providing default values when client_name is undefined
                const nameA = a.client_name ?? '';
                const nameB = b.client_name ?? '';
                return direction === 'asc' ? nameA.localeCompare(nameB, 'ja') : nameB.localeCompare(nameA, 'ja');
            }
            else if (columnName === '住所') {
                // Providing default values when client_name is undefined
                const nameA = a.address ?? '';
                const nameB = b.address ?? '';
                return direction === 'asc' ? nameA.localeCompare(nameB, 'ja') : nameB.localeCompare(nameA, 'ja');
            }
            else if (columnName === '工事完了日') {
                console.log('sortData Clicked')
                const dateA = new Date(a.complete_date);
                const dateB = new Date(b.complete_date);
                return direction === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
            }
            else if (columnName === '登録完了日') {
                console.log('sortData Clicked')
                const dateA = new Date(a.create_date);
                const dateB = new Date(b.create_date);
                return direction === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
            }
            else if (columnName === '完成したステージ') {
                console.log('sortData Clicked')
                const stageA = a.complete_stage ?? 0; // 0 or any other default value
                const stageB = b.complete_stage ?? 0; // 0 or any other default value
                console.log(`Comparing ${stageA} and ${stageB}: `, direction === 'asc' ? stageA - stageB : stageB - stageA);

                return direction === 'asc' ? stageA- stageB : stageB - stageA;
            }
            return 0; // Default return
        });
        setSortedData(sorted);
        setOrderDirection({ ...orderDirection, [columnName]: direction });
    };


    const handleFilterChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setFilterProgress(e.target.value);
    };

    const filteredData = filterProgress ? sortedData.filter(item => item.progress === filterProgress) : sortedData;


    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-center text-gray-500 ">
                <thead className="border-b bg-neutral-800 font-medium text-white ">
                    <tr>
                        <th scope="col" className="px-3 py-3 w-[4%]">No</th>
                        <th onClick={() => sortData('お客様名')} scope="col" className="px-3 py-3 w-[10%] clickable">お客様名</th>
                        <th onClick={() => sortData('住所')} scope="col" className="px-3 py-3 w-[20%] clickable">住所</th>
                        <th onClick={() => sortData('工事完了日')} scope="col" className="px-3 py-3 w-[10%] clickable">工事完了日</th>
                        <th onClick={() => sortData('登録完了日')} scope="col" className="px-3 py-3 w-[10%] clickable">登録完了日</th>
                        <th onClick={() => sortData('完成したページ数')} scope="col" className="px-3 py-3 w-[10%] clickable">完成したステージ</th>
                        <th scope="col" className="px-3 py-3 w-[10%] text-gray-500">
                            <select onChange={handleFilterChange} value={filterProgress}
                                className='form-select form-select-sm  block w-full px-2 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding
                                bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white
                            focus:border-blue-600 focus:outline-none'
                            >
                                <option value="">すべて状況</option>
                                <option value="処理中..">処理中..</option>
                                <option value="承認">承認</option>
                                <option value="差し戻し">差し戻し</option>
                                <option value="承認報告">承認報告</option>
                                <option value="差し戻し報告">差し戻し報告</option>
                            </select>
                        </th>
                        <th scope="col" className="px-3 py-3 w-[4%]">編集</th>
                        <th scope="col" className="px-3 py-3">MEMO</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item, index) => {
                        const memoItem = memos.find(memo => memo.id === item.report_id);
                        return (
                            <tr key={index} className="bg-white border-b ">
                                <td className="px-3 py-3">{index+1}</td>
                                <td className="px-3 py-3">{item.client_name}</td>
                                <td className="px-3 py-3">{item.address}</td>
                                <td className="px-3 py-3">{formatDate(item.complete_date)}</td>
                                <td className="px-3 py-3">{formatDate(item.create_date)}</td>
                                <td className="px-3 py-3">{`${item.complete_stage}/6`}</td>
                                <td className="px-3 py-3">{item.progress}</td>
                                <td className="px-3 py-3">
                                    <a href="#" onClick={() => handleEditClick(item.report_id)} className= " text-[17px] text-amber-500 hover:text-amber-700 font-medium underline">編集</a>
                                </td>
                                <td className="px-3 py-3">
                                    <input
                                        type="text"
                                        value={memoItem ? memoItem.memo : ''}
                                        onChange={(e) => handleMemoChange(item.report_id, e.target.value)}
                                        onBlur={() => updateUserTable(item.report_id, memoItem?.memo)}
                                        className="border-2 border-gray-200 p-1"
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default IndividualManageList;

