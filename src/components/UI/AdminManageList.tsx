import React, { memo, useEffect, useState } from 'react';
import router from 'next/router';
import { toast } from 'react-toastify';

import { supabase } from "@/components/Supabase/client";
import { AdminManageListData } from '../table.type';
import { formatDate } from '../util';

interface TableProps {
    data: AdminManageListData[];
    checkedState: boolean[];
    onCheckChange: (updatedCheckedState: boolean[]) => void;
}

interface OrderDirection {
    [key: string]: 'asc' | 'desc' | undefined;
}

// Table component
const AdminManageList: React.FC<TableProps> = ({ data, checkedState, onCheckChange }) => {

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

    const determineSendToText = (item: AdminManageListData) => {
        if (item.send_to_client) return "お客様";
        if (item.send_to_sales) return "販売会社";
        if (item.send_to_construct) return "施工会社";
        return ""; // default case if none are true
    };


    const fetchDataByReportId = async (reportId: any) => {
        try {
            const { data, error } = await supabase
                .from('user_table') // Replace with your actual table name
                .select('*')
                .eq('report_id', reportId)
                .single();
            if (error) throw error;
            return data;
        } catch (err) {
            console.error('Error fetching data:');
            return null;
        }
    };

    const saveDataByReportId = async (reportId: any, index: any) => {
        try {
            const { data, error } = await supabase
                .from('user_table') // Replace with your actual table name
                .upsert({
                    progress: progressStatus[index], report_id: reportId
                }, { onConflict: 'report_id' })
                .select()
            if (error) throw error;
            toast.success(`進捗状況が変更されました。`);
        } catch (err) {
            console.error('Error fetching data:');
            return null;
        }
    };


    const handleEditClick = async (reportId: any) => {
        console.log("reportID", reportId);
        localStorage.removeItem('myUUID')
        localStorage.setItem('myUUID', reportId);
        window.open('/register/regbasicinfo', '_blank');
    };

    const handleSaveClick = async (reportId: any, index: any) => {
        await saveDataByReportId(reportId, index);
    };

    const handleTransferClick = async (reportId: any, index: any) => {
        console.log("❤❤❤")
        const data = await fetchDataByReportId(reportId);
        console.log(reportId);
        if (progressStatus[index] === '承認' || progressStatus[index] === '差し戻し') {
            console.log("❤❤❤")
            const response = await fetch('/api/send_email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: progressStatus[index],
                    email: data.user_email,
                    username: data.user_name,
                    reportid: reportId,
                }),
            });
            try {
                if (response.ok) {
                    toast.success('メールを送信しました。', { type: 'success' });
                    // setIsLoading(false); 
                } else {
                    const errorData = await response.json();
                    console.log(errorData);
                    toast('Failed to send email', { type: 'error' });
                    console.error('Failed to send email');
                }
            } catch (error) {
                toast('Internal Server Error!', { type: 'error' });
                console.error('Error:', error);
                // setIsLoading(false); // Stop loading in case of error
            }
        }
        else {
            toast.warn("承認または差し戻しでステータスを変更するまで、メールを送信できません。")
        }

    };

    const handleDownloadPdf = async (reportId: any, completeStage: any) => {

        if (completeStage < 6) {
            toast.warn("100％登録されていないためダウンロードできません。");
            return;
        }
        setIsLoading(true);
        try {

            const response = await fetch(`/api/generate-pdf?reportId=${reportId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'report.pdf'; // Modify as needed
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            setIsLoading(false)

        } catch (error) {
            console.error('Error downloading the PDF:', error);
            setIsLoading(false)

        }
    };

    const handleUploadPdf = async (reportId: any, completeStage: any) => {
        if (completeStage < 6) {
            toast.warn("100％登録されていないためダウンロードできません。");
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`/api/generate-pdf?reportId=${reportId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const memoItem = memos.find(memo => memo.id === reportId);
            const siteCode = memoItem? memoItem.memo: '';
            const buffer = await response.arrayBuffer();
            try{
                const uploadResponse = await fetch (`/api/dandoli-register?siteCode=${siteCode}`, {
                    method: 'POST',
                    body: buffer
                });
                if (uploadResponse.ok) {
                    const result = await uploadResponse.json();
                    console.log('Success:', result);
                    // Handle success logic here, maybe set some state or display a message.
                  } else {
                    toast.warn('アップロードできません。 現場コードをもう一度確認してください。');
                    // If we get an HTTP error status, handle it here.
                    console.error('Server responded with an error:', uploadResponse.status);
                  }
            } catch (error){
                console.error('Error submitting form:', error);
            }
            setIsLoading(false)

        } catch (error) {
            console.error('Error downloading the PDF:', error);
            setIsLoading(false)
        }
    };



    const progressOptions = ["処理中..", "承認", "差し戻し", "承認報告", "差し戻し報告"];

    const handleProgressChange = async (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const newProgress = event.target.value;
        const newProgressStatus = [...progressStatus];

        newProgressStatus[index] = newProgress;
        setProgressStatus(newProgressStatus);
    };
    const [progressStatus, setProgressStatus] = useState<string[]>([]);

    const [sortedData, setSortedData] = useState(data);
    const [orderDirection, setOrderDirection] = useState<OrderDirection>({});
    const [filterProgress, setFilterProgress] = useState('');
    const filteredData = filterProgress ? sortedData.filter(item => item.progress === filterProgress) : sortedData;

    useEffect(() => {
        setSortedData(data);
    }, [data]);

    useEffect(() => {
        const progressValues = filteredData.map(item => item.progress || '');
        setProgressStatus(progressValues);
        console.log('Progress Status', progressValues)
    }, [filteredData]);


    const sortData = (columnName: string) => {
        const direction = orderDirection[columnName] === 'asc' ? 'desc' : 'asc';
        const sorted = [...data].sort((a, b) => {
            if (columnName === '販売店名') {
                // Providing default values when client_name is undefined
                const nameA = a.sales_name ?? '';
                const nameB = b.sales_name ?? '';
                return direction === 'asc' ? nameA.localeCompare(nameB, 'ja') : nameB.localeCompare(nameA, 'ja');
            }
            else if (columnName === '施行店名') {
                // Providing default values when client_name is undefined
                const nameA = a.construct_name ?? '';
                const nameB = b.construct_name ?? '';
                return direction === 'asc' ? nameA.localeCompare(nameB, 'ja') : nameB.localeCompare(nameA, 'ja');
            }
            else if (columnName === 'お客様名') {
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

                return direction === 'asc' ? stageA - stageB : stageB - stageA;
            }
            return 0; // Default return
        });
        setSortedData(sorted);
        setOrderDirection({ ...orderDirection, [columnName]: direction });
    };


    const handleFilterChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setFilterProgress(e.target.value);
    };

    const handleOnChange = (position: number) => {
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );
        onCheckChange(updatedCheckedState);
    };


    const handleMultiDownload = async () => {
        setIsLoading(true); // Start the loading state as bulk operation can take time

        // Use a default value for complete_stage in case it's undefined
        const defaultCompleteStage = 0;

        // Iterate through all checked items and download PDF for each
        for (let i = 0; i < checkedState.length; i++) {
            if (checkedState[i]) {
                // Get corresponding data for checked item
                const item = filteredData[i];

                // Determine the complete stage, and use default if undefined
                const completeStage = item.complete_stage !== undefined ? item.complete_stage : defaultCompleteStage;

                // Ensure that complete_stage is appropriate before downloading
                if (completeStage >= 6) {
                    await handleDownloadPdf(item.report_id, completeStage);
                } else {
                    toast.warn(`Item ${i + 1} is not fully registered and cannot be downloaded.`);
                }
            }
        }

        setIsLoading(false); // End the loading state after all operations
    };

    const handleMultiUpload = async () => {
        setIsLoading(true); // Start the loading state as bulk operation can take time

        // Use a default value for complete_stage in case it's undefined
        const defaultCompleteStage = 0;

        // Iterate through all checked items and download PDF for each
        for (let i = 0; i < checkedState.length; i++) {
            if (checkedState[i]) {
                // Get corresponding data for checked item
                const item = filteredData[i];

                // Determine the complete stage, and use default if undefined
                const completeStage = item.complete_stage !== undefined ? item.complete_stage : defaultCompleteStage;

                // Ensure that complete_stage is appropriate before downloading
                if (completeStage >= 6) {
                    await handleUploadPdf(item.report_id, completeStage);
                } else {
                    toast.warn(`Item ${i + 1} is not fully registered and cannot be downloaded.`);
                }
            }
        }

        setIsLoading(false); // End the loading state after all operations
    };


    const [isLoading, setIsLoading] = useState(false);

    return (
        <div>
            {
                isLoading ?
                    <div aria-label="読み込み中..." role="status" className="flex items-center space-x-2">
                        <svg className="h-10 w-10 animate-spin stroke-gray-500" viewBox="0 0 256 256">
                            <line x1="128" y1="32" x2="128" y2="64" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
                            <line x1="195.9" y1="60.1" x2="173.3" y2="82.7" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="24"></line>
                            <line x1="224" y1="128" x2="192" y2="128" stroke-linecap="round" stroke-linejoin="round" stroke-width="24">
                            </line>
                            <line x1="195.9" y1="195.9" x2="173.3" y2="173.3" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="24"></line>
                            <line x1="128" y1="224" x2="128" y2="192" stroke-linecap="round" stroke-linejoin="round" stroke-width="24">
                            </line>
                            <line x1="60.1" y1="195.9" x2="82.7" y2="173.3" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="24"></line>
                            <line x1="32" y1="128" x2="64" y2="128" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
                            <line x1="60.1" y1="60.1" x2="82.7" y2="82.7" stroke-linecap="round" stroke-linejoin="round" stroke-width="24">
                            </line>
                        </svg>
                        <span className="text-[15px] font-medium text-gray-500">処理中。</span>
                    </div> : null
            }
            <div className="flex justify-end">
                <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 
                                              focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2"
                    onClick={handleMultiDownload}
                >
                    マルチダウンロード
                </button>
                <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 
                                              focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2"
                    onClick={handleMultiUpload}
                >
                    マルチアップロード
                </button>
            </div>
            <div className={`overflow-x-auto ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                <table className="min-w-full tex-sm text-center text-gray-500 ">
                    <thead className="border-b bg-neutral-800 font-medium text-white ">
                        <tr>
                            <th scope="col" className="px-3 py-3 w-[4%]">管理No</th>
                            <th onClick={() => sortData('販売店名')} scope="col" className="px-3 py-3 w-[8%] clickable">販売店名</th>
                            <th onClick={() => sortData('施行店名')} scope="col" className="px-3 py-3 w-[8%] clickable">施行店名</th>
                            <th onClick={() => sortData('お客様名')} scope="col" className="px-3 py-3 w-[8%] clickable">お客様名</th>
                            <th onClick={() => sortData('住所')} scope="col" className="px-3 py-3 w-[16%] clickable">住所</th>
                            <th onClick={() => sortData('工事完了日')} scope="col" className="px-3 py-3 w-[8%] clickable">工事完了日</th>
                            <th onClick={() => sortData('登録完了日')} scope="col" className="px-3 py-3 w-[8%] clickable">登録完了日</th>
                            <th scope="col" className="px-3 py-3 w-[6%]">補償書送付先</th>
                            <th scope="col" className="px-3 py-3 w-[5%]">編集(確認)</th>
                            <th scope="col" className="px-3 py-3 w-[6%] text-gray-500">
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
                            <th scope="col" className="px-3 py-3 w-[4%]">状態保存</th>
                            <th scope="col" className="px-3 py-3 w-[4%]">メール送信</th>
                            <th scope="col" className="px-3 py-3 w-[4%]">ダウンロード</th>
                            <th scope="col" className="px-3 py-3 w-[3%]">選択</th>
                            <th scope="col" className="px-3 py-3">現場コード</th>
                            <th scope="col" className="px-3 py-3 w-[4%]">アップロード</th>

                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, index) => {
                            const memoItem = memos.find(memo => memo.id === item.report_id);
                            const sendToText = determineSendToText(item);

                            return (
                                <tr key={index} className="bg-white border-b ">
                                    <td className="px-3 py-3">{index + 1}</td>
                                    <td className="px-3 py-3">{item.sales_name}</td>
                                    <td className="px-3 py-3">{item.construct_name}</td>
                                    <td className="px-3 py-3">{item.client_name}</td>
                                    <td className="px-3 py-3">{item.address}</td>
                                    <td className="px-3 py-3">{formatDate(item.complete_date)}</td>
                                    <td className="px-3 py-3">{formatDate(item.create_date)}</td>

                                    <td className="px-3 py-3">{sendToText}</td>
                                    <td className="px-3 py-3">
                                        <a href="#" onClick={() => handleEditClick(item.report_id)} className=" text-[17px] text-amber-500 hover:text-amber-700 font-medium underline">編集</a>
                                    </td>
                                    <td className="px-3 py-3">
                                        <select
                                            className="form-select form-select-sm appearance-none block w-full px-3 py-3.5 text-base font-normal text-gray-700 bg-white bg-clip-padding
                                        bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white
                                    focus:border-blue-600 focus:outline-none"
                                            aria-label="Progress select"
                                            onChange={(e) => handleProgressChange(e, index)}
                                            value={progressStatus[index]}
                                        >
                                            {progressOptions.map((option, idx) => (
                                                <option key={idx} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-3 py-3">
                                        <a href="#" onClick={() => handleSaveClick(item.report_id, index)} className="text-[17px] text-blue-500 hover:text-blue-700 font-medium underline">保管</a>
                                    </td>
                                    <td className="px-3 py-3">
                                        <a href="#" onClick={() => handleTransferClick(item.report_id, index)} className="text-[17px] text-cyan-500 hover:text-cyan-700 font-medium underline">転送</a>
                                    </td>
                                    <td className="px-3 py-3">
                                        <a href="#" onClick={() => handleDownloadPdf(item.report_id, item.complete_stage)} className="text-[17px] text-lime-500 hover:text-lime-700 font-medium underline">ダウンロード</a>
                                    </td>
                                    <td className="px-3 py-3">
                                        <input
                                            type="checkbox"
                                            id={`custom-checkbox-${index}`}
                                            checked={checkedState[index]}
                                            onChange={() => handleOnChange(index)}
                                            className='w-[25px] h-[25px]'
                                        />
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
                                    <td className="px-3 py-3">
                                        <a href="#" onClick={() => handleUploadPdf(item.report_id, item.complete_stage)} className="text-[17px] text-lime-500 hover:text-lime-700 font-medium underline">アップロード</a>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminManageList;
