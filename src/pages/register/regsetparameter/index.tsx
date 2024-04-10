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


const Page = () => {

    const handleClose = () => {
        router.push('/register/regdccheck');
    };

    const handleSave = async () => {

        const newInvalidFields = {
            systemParamImageString: !systemParamImageString, protectParamImageString: !protectParamImageString,
            invParamImageString: !invParamImageString, invStorageImageString: !invStorageImageString
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
            router.push('/register/regtestresult');
        }
        const myUUID = localStorage.getItem('myUUID');
        const { data: { user } } = await supabase.auth.getUser();

        const userID = user?.id;

        const { data: reportData, error } = await supabase
            .from('user_table')
            .select('*')
            .eq('user_id', userID)
            .eq('report_id', myUUID)
            .single();
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
            // Save set_param
            const { data: systemParameterData, error: systemParameterError } = await supabase
                .from('set_param')
                .upsert({
                    system_image_url: systemParamImageString, protect_image_url: protectParamImageString, inv_image_url: invParamImageString,
                    inv_s_image_url: invStorageImageString, user_id: userID, report_id: myUUID
                }, { onConflict: 'report_id' })
            if (systemParameterError) throw systemParameterError;

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
                // Fetch data from set_param
                const { data: systemParameterData, error: systemParameterError } = await supabase
                    .from('set_param')
                    .select()
                    .eq('report_id', myUUID)
                    .single(); // Assuming you expect only one row
                if (systemParameterError) {
                    throw systemParameterError;
                }
                if (systemParameterData) {
                    setSystemParamImageString(systemParameterData.system_image_url);
                    setProtectParamImageString(systemParameterData.protect_image_url);
                    setINVParamImageString(systemParameterData.inv_image_url);
                    setINVStorageImageString(systemParameterData.inv_s_image_url);
                    setIsNew(false);
                }
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
        setPdfName('5.pdf');
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



    const [systemParamImageString, setSystemParamImageString] = useState('');
    const [protectParamImageString, setProtectParamImageString] = useState('');
    const [invParamImageString, setINVParamImageString] = useState('');
    const [invStorageImageString, setINVStorageImageString] = useState('');

    const handleSystemParamImageChange = (newString: string) => {
        setSystemParamImageString(newString);
    };
    const handleProtectParamImageChange = (newString: string) => {
        setProtectParamImageString(newString);
    };
    const handleINVParamImageChange = (newString: string) => {
        setINVParamImageString(newString);
    };

    const handleINVStorageImageChange = (newString: string) => {
        setINVStorageImageString(newString);
    };

    return (
        <RootLayout>
            {
                isLoading ?
                    <>読み込み中...</> :
                    <div className="m-10">
                        <p className=" m-5 text-[30px] flex justify-center mb-5">
                            ⑤設定・パラメータ
                        </p>
                        <p className=" m-5 text-[25px] flex justify-center">
                            システムパラメータ
                        </p>
                        <div className="flex justify-center">
                            <ImageUploadComponent
                                width={800}
                                height={400}
                                dragDropText="※PCS設定アプリの『システムパラメータ』の画面を添付"
                                onImageParseStringChange={handleSystemParamImageChange}
                                imageSrc={systemParamImageString}
                            />
                        </div>

                        <p className=" m-5 text-[25px] flex justify-center">
                            保護パラメータ
                        </p>
                        <div className="flex justify-center">
                            <ImageUploadComponent
                                width={800}
                                height={400}
                                dragDropText="※PCS設定アプリの『保護パラメータ』の画面を添付"
                                onImageParseStringChange={handleProtectParamImageChange}
                                imageSrc={protectParamImageString}
                            />
                        </div>

                        <p className=" m-5 text-[25px] flex justify-center">
                            INV情報-PV
                        </p>
                        <div className="flex justify-center">
                            <ImageUploadComponent
                                width={800}
                                height={400}
                                dragDropText="※PCS設定アプリの『INV情報-InputPVパラメータ』を添付"
                                onImageParseStringChange={handleINVParamImageChange}
                                imageSrc={invParamImageString}
                            />
                        </div>

                        <p className=" m-5 text-[25px] flex justify-center">
                            INV情報-電池
                        </p>
                        <div className="flex justify-center">
                            <ImageUploadComponent
                                width={800}
                                height={400}
                                dragDropText="※PCS設定アプリの『INV情報-Input(電池)パラメータ』を添付"
                                onImageParseStringChange={handleINVStorageImageChange}
                                imageSrc={invStorageImageString}
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

