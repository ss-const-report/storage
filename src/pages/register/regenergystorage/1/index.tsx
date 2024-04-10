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
        router.push('/register/regbasicinfo');
    };

    const handleSave = async () => {
        const newInvalidFields = {
            conditionerImageString: !conditionerImageString,
            conditionerSerialImageString: !conditionerSerialImageString,
            storageImageString: !storageImageString, storageSerialControlImageString: !storageSerialControlImageString,
            storageSerialUnitOneImageString: !storageSerialUnitOneImageString, storageSerialUnitTwoImageString: !storageSerialUnitTwoImageString,
            storageSerialUnitThreeImageString: !storageSerialUnitThreeImageString,
            spaceIssueReason: isSpaceIssueChecked && !spaceIssueReason // Conditional validation


        };
        const isAnyFieldInvalid = Object.values(newInvalidFields).some(value => value);
        if (isAnyFieldInvalid) {
            const invalidFieldNames = Object.entries(newInvalidFields)
                .filter(([_, value]) => value)
                .map(([key, _]) => key);
            showErrorToast(invalidFieldNames);
        } else {
            // Save data and navigate if all fields are valid
            await saveDataToSupabase();
            router.push('/register/regenergystorage/2');
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

        setIsLoading(true)

        try {
            const { data: spaceIssueData, error: sapceIssueError } = await supabase
                .from('space_issue')
                .upsert({
                    reason: isSpaceIssueChecked ? spaceIssueReason : '', conditioner_image_url: conditionerImageString,
                    conditioner_serial_image_url: conditionerSerialImageString, storage_image_url: storageImageString,
                    storage_serial_control_image_url: storageSerialControlImageString, storage_serial_one_image_url: storageSerialUnitOneImageString,
                    storage_serial_two_image_url: storageSerialUnitTwoImageString, storage_serial_three_image_url: storageSerialUnitThreeImageString,
                    user_id: userID, report_id: myUUID
                }, { onConflict: 'report_id' })
            if (sapceIssueError) throw sapceIssueError;

            console.log(userEmail);
            // Save user_table
            updateUserTable({
                userID: userID,
                userEmail: userEmail,
                userName: userName,
                myUUID: myUUID,
                progress: "処理中..", // Translates to "Processing.."
                shouldIncrementStage: isNew
            })
                .then(() => console.log("Update successful."))
                .catch(err => console.error("Error in update:", err));

            setIsLoading(false)

        } catch (error) {
            setIsLoading(false)
            console.error('Error saving data to Supabase:', error);
        }
    };

    useEffect(() => {
        const myUUID = localStorage.getItem('myUUID');
        async function fetchData() {
            setIsLoading(true)
            try {
                // Fetch data from space_issue
                const { data: SpaceIssueData, error: SpaceIssueError } = await supabase
                    .from('space_issue')
                    .select()
                    .eq('report_id', myUUID)
                    .single(); // Assuming you expect only one row
                if (SpaceIssueError) {
                    throw SpaceIssueError;
                }
                if (SpaceIssueData) {
                    setSpaceIssueReason(SpaceIssueData.reason);
                    setConditionerImageString(SpaceIssueData.conditioner_image_url);
                    setConditionerSerialImageString(SpaceIssueData.conditioner_serial_image_url);
                    setStorageImageString(SpaceIssueData.storage_image_url);
                    setStorageSerialControlImageString(SpaceIssueData.storage_serial_control_image_url);
                    setStorageSerialUnitOneImageString(SpaceIssueData.storage_serial_one_image_url);
                    setStorageSerialUnitTwoImageString(SpaceIssueData.storage_serial_two_image_url);
                    setStorageSerialUnitThreeImageString(SpaceIssueData.storage_serial_three_image_url);
                    setIsNew(false);
                }

                if (SpaceIssueData.reason)
                    setIsSpaceIssueChecked(true)
                console.log("❤")
                setIsLoading(false)

            } catch (error) {
                setIsLoading(false)
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        // Set the PDF name based on some logic or props
        setPdfName('2.pdf');
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

    const [conditionerImageString, setConditionerImageString] = useState('');
    const [conditionerSerialImageString, setConditionerSerialImageString] = useState('');
    const [storageImageString, setStorageImageString] = useState('');
    const [storageSerialControlImageString, setStorageSerialControlImageString] = useState('');
    const [storageSerialUnitOneImageString, setStorageSerialUnitOneImageString] = useState('');
    const [storageSerialUnitTwoImageString, setStorageSerialUnitTwoImageString] = useState('');
    const [storageSerialUnitThreeImageString, setStorageSerialUnitThreeImageString] = useState('');


    const handleSpaceIssueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsSpaceIssueChecked(event.target.checked); // Update the state based on checkbox status
        toggleElement();
        // Additional actions here
    };

    const handleSpaceIssueReason = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSpaceIssueReason(event.target.value);
    };

    const handleConditionerImageChange = (newString: string) => {
        setConditionerImageString(newString);
    };
    const handleConditionerSerialImageChange = (newString: string) => {
        setConditionerSerialImageString(newString);
    };
    const handleStorageImageChange = (newString: string) => {
        setStorageImageString(newString);
    };
    const handleStorageSerialControlImageChange = (newString: string) => {
        setStorageSerialControlImageString(newString);
    };
    const handleStorageSerialUnitOneImageChange = (newString: string) => {
        setStorageSerialUnitOneImageString(newString);
    };
    const handleStorageSerialUnitTwoImageChange = (newString: string) => {
        setStorageSerialUnitTwoImageString(newString);
    };
    const handleStorageSerialUnitThreeImageChange = (newString: string) => {
        setStorageSerialUnitThreeImageString(newString);
    };


    return (
        <RootLayout>
            {
                isLoading ?
                    <>読み込み中...</> :
                    <div className="m-10">
                        <p className=" m-5 text-[30px] flex justify-center mb-5">
                            ②蓄電池・PCS情報
                        </p>
                        <p className=" m-5 text-[25px] flex justify-center">
                            【写真貼付】機器の設置状況　各機器の設置状況が分かる写真を確認し、貼付して下さい
                        </p>
                        <div className=" flex justify-center text-[25px]">
                            蓄電システム　全体設置状況
                        </div>
                        <div className="m-3 flex items-center justify-center  text-[20px]">
                            設置スペースが確保できない場合は、右のチェックボックスにチェックを入れ、理由を記載してください。（理由必須）
                            <CheckboxComponent id="checkbox-1" label="問題あり" checkedStatus={isSpaceIssueChecked}
                                onCheckboxChange={handleSpaceIssueChange}
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
                        <div className="flex flex-col item-center justify-center">
                            <div className=" flex justify-center text-[20px] m-5">
                                ※設置要件が満たされていない場合、アフターメンテナンスができない場合があります。
                            </div>
                            <div className="flex justify-center">
                                <img className="h-auto max-w-full" src="/img/画像1.png" alt="image description" />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-center mt-10">
                            <div className="flex justify-center sm:mr-8">
                                <ImageUploadComponent
                                    width={400}
                                    height={400}
                                    dragDropText="パワーコンディショナの設置状況写真"
                                    onImageParseStringChange={handleConditionerImageChange}
                                    imageSrc={conditionerImageString} // Pass the state as a prop
                                />
                            </div>
                            <div className="flex justify-center">
                                <ImageUploadComponent
                                    width={400}
                                    height={400}
                                    dragDropText="機種銘板の写真(シリアルNO.が読み取れるもの)"
                                    onImageParseStringChange={handleConditionerSerialImageChange}
                                    imageSrc={conditionerSerialImageString} // Pass the state as a prop
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-center  mt-10">
                            <div className="flex justify-center sm:mr-8">
                                <ImageUploadComponent
                                    width={400}
                                    height={400}
                                    dragDropText="蓄電池の設置状況写真"
                                    onImageParseStringChange={handleStorageImageChange}
                                    imageSrc={storageImageString} // Pass the state as a prop
                                />
                            </div>
                            <div className="flex flex-col justify-center">
                                <ImageUploadComponent
                                    width={400}
                                    height={400}
                                    dragDropText="機種銘板の写真(シリアルNO.が読み取れるもの)"
                                    onImageParseStringChange={handleStorageSerialControlImageChange}
                                    imageSrc={storageSerialControlImageString} // Pass the state as a prop
                                />

                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-center  mt-10">
                            <ImageUploadComponent
                                width={400}
                                height={400}
                                dragDropText="機種銘板の写真(シリアルNO.が読み取れるもの)"
                                onImageParseStringChange={handleStorageSerialUnitOneImageChange}
                                imageSrc={storageSerialUnitOneImageString} // Pass the state as a prop
                            />
                            <ImageUploadComponent
                                width={400}
                                height={400}
                                dragDropText="機種銘板の写真(シリアルNO.が読み取れるもの)"
                                onImageParseStringChange={handleStorageSerialUnitTwoImageChange}
                                imageSrc={storageSerialUnitTwoImageString} // Pass the state as a prop
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row justify-center  mt-10">
                            <ImageUploadComponent
                                width={400}
                                height={400}
                                dragDropText="機種銘板の写真(シリアルNO.が読み取れるもの)"
                                onImageParseStringChange={handleStorageSerialUnitThreeImageChange}
                                imageSrc={storageSerialUnitThreeImageString} // Pass the state as a prop
                            />
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

