
import CheckboxComponent from "@/components/UI/CheckBox";
import CustomInput from "@/components/UI/CustomInput";
import ImageUploadComponent from "@/components/UI/ImageUploadComponent";
import SaveButton from "@/components/UI/Buttons/SaveNextSubmitBtn";
import { supabase } from "@/components/Supabase/client";
import router from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { updateUserTable } from "@/components/DataHandling";
import BackBtn from "@/components/UI/Buttons/BackBtn";
import RootLayout from "@/components/RootLayout";
import PdfContext from '@/contexts/PdfContext';
import { toggleElement } from "@/components/util";





const Page = () => {


    const handleClose = () => {
        router.push('/register/regenergystorage/1');
    };

    const handleSave = async () => {
        const newInvalidFields = {
            switchImageString: !switchImageString, switchSerialImageString: !switchSerialImageString,
            smartImageString: !smartImageString, smartBreakerImageString: !smartBreakerImageString,
            smartSerialImageString: !smartSerialImageString
            // ... add checks for other fields in the same manner
        };

        const isAnyFieldInvalid = Object.values(newInvalidFields).some(value => value);

        if (isAnyFieldInvalid) {
            // List of fields that are invalid
            const invalidFieldNames = Object.entries(newInvalidFields)
                .filter(([_, value]) => value)
                .map(([key, _]) => key);
            showErrorToast(invalidFieldNames);
        } else {
            // Save data and navigate if all fields are valid
            await saveDataToSupabase();
            router.push('/register/regdccheck');
        }
    };



    const showErrorToast = (invalidFields: any[]) => {
        // toast.warning(`Please fill in all required fields: ${invalidFields.join(', ')}`);
        toast.warning(`すべての項目を正確に記入してください。`);
    };

    const saveDataToSupabase = async () => {

        const { data: { user } } = await supabase.auth.getUser();
        const userID = user?.id;
        const userEmail = user?.email;
        const userName = user?.user_metadata ? user.user_metadata.full_name : 'Name not set';
        const myUUID = localStorage.getItem('myUUID');
        setIsLoading(true);

        try {
            // Save total_space_issue
            const { data: totalSpaceIssueData, error: totalSpaceIssueError } = await supabase
                .from('total_space_issue')
                .upsert({
                    reason: spaceIssueReason,
                    switch_image_url: switchImageString, switch_serial_image_url: switchSerialImageString,
                    smart_image_url: smartImageString,
                    smart_breaker_image_url: smartBreakerImageString, smart_serial_image_url: smartSerialImageString, user_id: userID, report_id: myUUID
                }, { onConflict: 'report_id' })
            if (totalSpaceIssueError) throw totalSpaceIssueError;

            // Save user_table
            updateUserTable({
                userID: userID,
                userEmail: userEmail,
                userName: userName,
                myUUID: myUUID,
                progress: "処理中..",
                shouldIncrementStage: isNew
            })
                .then(() => console.log("Update successful."))
                .catch(err => console.error("Error in update:", err));

            setIsLoading(false);

        } catch (error) {
            setIsLoading(false);

            console.error('Error saving data to Supabase:', error);
        }
    };

    useEffect(() => {
        const myUUID = localStorage.getItem('myUUID');
        async function fetchData() {
            setIsLoading(true);

            try {
                // Fetch data from total_space_issue
                const { data: TotalSpaceIssueData, error: TotalSpaceIssueError } = await supabase
                    .from('total_space_issue')
                    .select()
                    .eq('report_id', myUUID)
                    .single(); // Assuming you expect only one row
                if (TotalSpaceIssueError) {
                    throw TotalSpaceIssueError;
                }
                if (TotalSpaceIssueData) {
                    setSpaceIssueReason(TotalSpaceIssueData.reason);
                    setSwitchImageString(TotalSpaceIssueData.switch_image_url);
                    setswitchSerialImageString(TotalSpaceIssueData.switch_serial_image_url);
                    setSmartImageString(TotalSpaceIssueData.smart_image_url);
                    setSmartBreakerImageString(TotalSpaceIssueData.smart_breaker_image_url);
                    setsmartSerialImageString(TotalSpaceIssueData.smart_serial_image_url);
                    setIsNew(false);
                }

                if (TotalSpaceIssueData.reason)
                    setIsSpaceIssueChecked(true)
                setIsLoading(false);

            } catch (error) {
                setIsLoading(false);

                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        // Set the PDF name based on some logic or props
        setPdfName('3.pdf');
    }, []);

    useEffect(() => {
        const loginCheck = localStorage.getItem("userToken");
    
        if (!loginCheck) {
          router.push("/");
        }
      }, []);

      


    const { setPdfName } = useContext(PdfContext);

    const [isNew, setIsNew] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState(false);

    const [isSpaceIssueChecked, setIsSpaceIssueChecked] = useState(false);
    const [spaceIssueReason, setSpaceIssueReason] = useState<string>('');
    // switch image data
    const [switchImageString, setSwitchImageString] = useState('');
    const [switchSerialImageString, setswitchSerialImageString] = useState('');
    // smart AI image data
    const [smartImageString, setSmartImageString] = useState('');
    const [smartBreakerImageString, setSmartBreakerImageString] = useState('');
    const [smartSerialImageString, setsmartSerialImageString] = useState('');

    const handleSpaceIssueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsSpaceIssueChecked(event.target.checked);
        toggleElement();
    };

    const handleSpaceIssueReason = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSpaceIssueReason(event.target.value);
    };


    // switch image data
    const handleSwitchImageChanged = (newString: string) => {
        setSwitchImageString(newString);
    };
    const handleSwitchSerialImageChanged = (newString: string) => {
        setswitchSerialImageString(newString);
    };
    // smart AI image data
    const handleSmartImageChanged = (newString: string) => {
        setSmartImageString(newString);
    };
    const handleSmartBreakerImageChanged = (newString: string) => {
        setSmartBreakerImageString(newString);
    };
    const handleSmartSerialImageChanged = (newString: string) => {
        setsmartSerialImageString(newString);
    };

    return (
        <RootLayout>
            {
                isLoading ?
                    <>読み込み中...</> :
                    <div className="m-10">
                        <p className=" m-5 text-[30px] flex justify-center mb-5">
                            ③切替盤・スマートAI
                        </p>
                        <p className=" m-5 text-[25px] flex justify-center">
                            【写真貼付】機器の設置状況　各機器の設置状況が分かる写真を確認し、貼付して下さい
                        </p>
                        <div className=" flex justify-center text-[25px]">
                            蓄電システム　全体設置状況
                        </div>
                        <div className="m-3 flex items-center justify-center  text-[20px]">
                            設置スペースに問題がない場合は選択しないでください。
                            <CheckboxComponent id="checkbox-1" label="問題あり" checkedStatus={isSpaceIssueChecked} onCheckboxChange={handleSpaceIssueChange}
                            />
                        </div>
                        {isSpaceIssueChecked && (
                            <div className="m-2 flex items-center justify-center">
                                <CustomInput
                                    title="離隔,PCS高さを 確保できない理由"
                                    width="900px"
                                    value={spaceIssueReason}
                                    handleChange={handleSpaceIssueReason}
                                />
                            </div>
                        )}
                        <div className=" flex justify-center text-[20px] m-5">
                            ※設置要件が満たされていない場合、アフターメンテナンスができない場合があります。
                        </div>
                        <div className="m-5 flex items-center justify-center  text-[20px]">
                            スマートスイッチボックス
                        </div>
                        <div className="flex flex-col sm:flex-row justify-center mt-10">
                            <div className="flex justify-center ">
                                <img className="h-auto max-w-full" src="/img/画像２.png" alt="image description" />
                            </div>

                        </div>
                        <div className="flex flex-col sm:flex-row justify-center  mt-10">
                            <div className="flex justify-center sm:mr-8">
                                <ImageUploadComponent
                                    width={400}
                                    height={400}
                                    dragDropText="スマートスイッチボックスの設置状況写真"
                                    onImageParseStringChange={handleSwitchImageChanged}
                                    imageSrc={switchImageString}
                                />
                            </div>

                            <div className="flex justify-center">
                                <ImageUploadComponent
                                    width={400}
                                    height={400}
                                    dragDropText="機種銘板の写真(シリアルNO.が読み取れるもの)"
                                    onImageParseStringChange={handleSwitchSerialImageChanged}
                                    imageSrc={switchSerialImageString}
                                />
                            </div>

                        </div>
                        <div className="m-5 flex items-center justify-center  text-[20px]  mt-10">
                            スマートAI
                        </div>
                        <div className="flex flex-col sm:flex-row justify-center">
                            <div className="flex justify-center ">
                                <img className="h-auto max-w-full" src="/img/画像３.png" alt="image description" />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-center  mt-10">
                            <div className="flex justify-center sm:mr-8">
                                <ImageUploadComponent
                                    width={400}
                                    height={400}
                                    dragDropText="スマートAIの設置状況写真"
                                    onImageParseStringChange={handleSmartImageChanged}
                                    imageSrc={smartImageString}
                                />
                            </div>

                            <div className="flex justify-center sm:mr-8">
                                <ImageUploadComponent
                                    width={400}
                                    height={400}
                                    dragDropText="AIブレーカ位置の写真"
                                    onImageParseStringChange={handleSmartBreakerImageChanged}
                                    imageSrc={smartBreakerImageString}
                                />
                            </div>

                            <div className="flex justify-center">
                                <ImageUploadComponent
                                    width={400}
                                    height={400}
                                    dragDropText="機種銘板の写真(シリアルNO.が読み取れるもの)"
                                    onImageParseStringChange={handleSmartSerialImageChanged}
                                    imageSrc={smartSerialImageString}
                                />
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-10 sm:mx-20 mx-0">
                            <BackBtn onClick={handleClose}>
                                戻る
                            </BackBtn>
                            <SaveButton onClick={handleSave}>
                                保管と次
                            </SaveButton>
                        </div>
                    </div>
            }
        </RootLayout>
    );
};

export default Page;

