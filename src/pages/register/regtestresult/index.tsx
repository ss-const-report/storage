
import SaveButton from "@/components/UI/Buttons/SaveNextSubmitBtn";
import TestResultTable from "@/components/UI/Tables/TestResultTable";
import TestSummaryTable from "@/components/UI/Tables/TestSummaryTable";
import { supabase } from "@/components/Supabase/client";
import router from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';


import RegisterCompleteModal from "@/components/UI/RegisterCompleteModal";
import BackBtn from "@/components/UI/Buttons/BackBtn";
import { updateUserTable } from "@/components/DataHandling";
import RootLayout from "@/components/RootLayout";
import PdfContext from '@/contexts/PdfContext';
import AllCheckBtn from "@/components/UI/Buttons/AllCheckBtn";

import {
    commonCheckList, commmonCheckPoint, storageCheckList, storageCheckPoint, conditionerCheckList, conditionerCheckPoint,
    switchCheckList, switchCheckPoint, smartCheckList, smartCheckPoint, summaryCheckList
} from "../../../utils/pdf-helper"


const Page = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        router.push('/home');

    };

    const handleClose = () => {
        router.push('/register/regsetparameter');
    };

    const handleSave = async () => {
        const allCommonChecked = commonCheckedState.every(value => value === true);
        const allStorageChecked = storageCheckedState.every(value => value === true);
        const allConditionerChecked = conditionerCheckedState.every(value => value === true);
        const allSwitchChecked = switchCheckedState.every(value => value === true);
        const allSmartChecked = smartCheckedState.every(value => value === true);
        const allSummaryChecked = testSummaryTableCheckedState.every(value => value === true);
        const myUUID = localStorage.getItem('myUUID');

        setIsLoading(true);
        
        if (allCommonChecked && allStorageChecked && allConditionerChecked && allSwitchChecked && allSmartChecked && allSummaryChecked) {
            const { data: { user } } = await supabase.auth.getUser();
            const userID = user?.id;
            
            console.log('userID', userID)
            const { data: reportData, error } = await supabase
            .from('user_table')
            .select('*')
            .eq('user_id', userID)
            .eq('report_id', myUUID)
            .single();
            if (reportData) {
                console.log('compalte_stea', reportData.complete_stage);
                if (reportData.complete_stage == 5) {
                    setIsModalOpen(!isModalOpen);
                }
                else {
                    toast.warning(`すべてのページを登録していない場合は登録完了できません。`);
                }
            }
            await saveDataToSupabase();

            setIsNew(false);
        } else {
            // Show warning toast
            toast.warning(`「全てにチェック」が入っていない場合には登録完了できません。`);
        }
        setIsLoading(false);

    };

    const handleAllCheck = () => {
        setCommonCheckedState(new Array(commonCheckList.length).fill(true));
        setStorageCheckedState(new Array(storageCheckList.length).fill(true));
        setConditionerCheckedState(new Array(conditionerCheckList.length).fill(true));
        setSwitchCheckedState(new Array(switchCheckList.length).fill(true));
        setSmartCheckedState(new Array(smartCheckList.length).fill(true));
        // setTestSummaryTableCheckedState(new Array(summaryCheckList.length).fill(true));
    }

    const handleAllUnCheck = () => {
        setCommonCheckedState(new Array(commonCheckList.length).fill(false));
        setStorageCheckedState(new Array(storageCheckList.length).fill(false));
        setConditionerCheckedState(new Array(conditionerCheckList.length).fill(false));
        setSwitchCheckedState(new Array(switchCheckList.length).fill(false));
        setSmartCheckedState(new Array(smartCheckList.length).fill(false));
        setTestSummaryTableCheckedState(new Array(summaryCheckList.length).fill(false));
    }



    const saveDataToSupabase = async () => {

        const { data: { user } } = await supabase.auth.getUser();
        const userID = user?.id;
        const userEmail = user?.email;
        const userName = user?.user_metadata ? user.user_metadata.full_name : 'Name not set';
        const myUUID = localStorage.getItem('myUUID');
        setIsLoading(true);

        try {
            // Save test_result
            const { data: testResultData, error: testResultError } = await supabase
                .from('test_result')
                .upsert({
                    common_unit_check: commonCheckedState.at(0), storage_install_temperature: storageCheckedState.at(0),
                    storage_flammable_material: storageCheckedState.at(1), storage_correct_wiring: storageCheckedState.at(2),
                    storage_input_terminal: storageCheckedState.at(3), storage_entrance_check: storageCheckedState.at(4),
                    storage_internal_check: storageCheckedState.at(5), storage_cable_check: storageCheckedState.at(6),
                    storage_connector_check: storageCheckedState.at(7), conditioner_pcs_height: conditionerCheckedState.at(0),
                    conditioner_flammable_material: conditionerCheckedState.at(1), conditioner_protect_water: conditionerCheckedState.at(2),
                    conditioner_wiring_check: conditionerCheckedState.at(3), conditioner_switch_check: conditionerCheckedState.at(4),
                    conditioner_correct_wiring: conditionerCheckedState.at(5), conditioner_entrance_check: conditionerCheckedState.at(6),
                    conditioner_input_terminal: conditionerCheckedState.at(7), conditioner_ground_check: conditionerCheckedState.at(8),
                    conditioner_alone_ground: conditionerCheckedState.at(9), conditioner_status_ramp: conditionerCheckedState.at(10),
                    switch_correct_wiring: switchCheckedState.at(0), switch_input_terminal: switchCheckedState.at(1),
                    switch_inner_check: switchCheckedState.at(2), smart_cable_using: smartCheckedState.at(0),
                    smart_cable_location: smartCheckedState.at(1), smart_set_complete: smartCheckedState.at(2),
                    trial_alone_test: testSummaryTableCheckedState.at(0), trial_switch_test: testSummaryTableCheckedState.at(1),
                    user_id: userID, report_id: myUUID
                }, { onConflict: 'report_id' })
            if (testResultError) throw testResultError;

            // Save user_table
            updateUserTable({
                userID: userID,
                userEmail: userEmail,
                userName: userName,
                myUUID: myUUID,
                progress: "処理中..",
                shouldIncrementStage: isNew,
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
                // Fetch data from test_result
                const { data: testResultData, error: testResultError } = await supabase
                    .from('test_result')
                    .select()
                    .eq('report_id', myUUID)
                    .single(); // Assuming you expect only one row
                if (testResultError) {
                    throw testResultError;
                }
                if (testResultData) {
                    const updatedCommonCheck = [
                        testResultData.common_unit_check,
                    ];
                    setCommonCheckedState(updatedCommonCheck);
                    const updatedStorageCheck = [
                        testResultData.storage_install_temperature,
                        testResultData.storage_flammable_material,
                        testResultData.storage_correct_wiring,
                        testResultData.storage_input_terminal,
                        testResultData.storage_entrance_check,
                        testResultData.storage_internal_check,
                        testResultData.storage_cable_check,
                        testResultData.storage_connector_check,

                    ];
                    setStorageCheckedState(updatedStorageCheck);
                    const updateConditionerCheck = [
                        testResultData.conditioner_pcs_height,
                        testResultData.conditioner_flammable_material,
                        testResultData.conditioner_protect_water,
                        testResultData.conditioner_wiring_check,
                        testResultData.conditioner_switch_check,
                        testResultData.conditioner_correct_wiring,
                        testResultData.conditioner_entrance_check,
                        testResultData.conditioner_input_terminal,
                        testResultData.conditioner_ground_check,
                        testResultData.conditioner_alone_ground,
                        testResultData.conditioner_status_ramp,

                    ];
                    setConditionerCheckedState(updateConditionerCheck);
                    const updateSwitchCheck = [
                        testResultData.switch_correct_wiring,
                        testResultData.switch_input_terminal,
                        testResultData.switch_inner_check,
                    ];
                    setSwitchCheckedState(updateSwitchCheck);
                    const updateSmartCheck = [
                        testResultData.smart_cable_using,
                        testResultData.smart_cable_location,
                        testResultData.smart_set_complete,
                    ];
                    setSmartCheckedState(updateSmartCheck);
                    const updateSummaryCheck = [
                        testResultData.trial_switch_test,
                        testResultData.trial_alone_test,
                    ];
                    setTestSummaryTableCheckedState(updateSummaryCheck);
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
        setPdfName('6.pdf');
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

    const [commonCheckedState, setCommonCheckedState] = useState(new Array(commonCheckList.length).fill(false));
    const handleCommonCheckChange = (updatedCheckedState: React.SetStateAction<any[]>) => {
        setCommonCheckedState(updatedCheckedState);
    };

    const [storageCheckedState, setStorageCheckedState] = useState(new Array(storageCheckList.length).fill(false));
    const handleStorageCheckChange = (updatedCheckedState: React.SetStateAction<any[]>) => {
        setStorageCheckedState(updatedCheckedState);
    }

    const [conditionerCheckedState, setConditionerCheckedState] = useState(new Array(conditionerCheckList.length).fill(false));
    const handleConditionerCheckChange = (updatedCheckedState: React.SetStateAction<any[]>) => {
        setConditionerCheckedState(updatedCheckedState);
    };

    const [switchCheckedState, setSwitchCheckedState] = useState(new Array(switchCheckList.length).fill(false));
    const handleSwitchCheckChange = (updatedCheckedState: React.SetStateAction<any[]>) => {
        setSwitchCheckedState(updatedCheckedState);
    };

    const [smartCheckedState, setSmartCheckedState] = useState(new Array(smartCheckList.length).fill(false));
    const handleSmartCheckChange = (updatedCheckedState: React.SetStateAction<any[]>) => {
        setSmartCheckedState(updatedCheckedState);
    };

    const [testSummaryTableCheckedState, setTestSummaryTableCheckedState] = useState(new Array(summaryCheckList.length).fill(false));
    const handleTestSummaryTableCheckChange = (updatedCheckedState: React.SetStateAction<any[]>) => {
        setTestSummaryTableCheckedState(updatedCheckedState);
    };

    return (
        <RootLayout>
            {
                isLoading ?
                    <>読み込み中...</> :
                    <div className="m-10">
                        <div className="m-5  flex items-center justify-center text-[30px] mb-5">
                            ⑥竣工チェックリスト
                        </div>
                        <div className="m-5  flex items-center justify-center text-[25px]">
                            共通
                        </div>
                        <div className="mx-10 md:mx-40">
                            <div className="flex justify-end">
                                <AllCheckBtn onClick={handleAllCheck}>
                                    すべて選択
                                </AllCheckBtn>
                                <AllCheckBtn onClick={handleAllUnCheck}>
                                    すべて解除
                                </AllCheckBtn>
                            </div>
                            <TestResultTable
                                rows={1}
                                parameters={commonCheckList}
                                points={commmonCheckPoint}
                                onCheckChange={handleCommonCheckChange}
                                checkedState={commonCheckedState}
                            />
                        </div>
                        <div className="m-5  flex items-center justify-center text-[25px]">
                            蓄電池
                        </div>
                        <div className="mx-10 md:mx-40">
                            <TestResultTable
                                rows={8}
                                parameters={storageCheckList}
                                points={storageCheckPoint}
                                onCheckChange={handleStorageCheckChange}
                                checkedState={storageCheckedState}
                            />
                        </div>
                        <div className="m-5  flex items-center justify-center text-[25px]">
                            パワーコンディショナ
                        </div>
                        <div className="mx-10 md:mx-40">
                            <TestResultTable
                                rows={11}
                                parameters={conditionerCheckList}
                                points={conditionerCheckPoint}
                                onCheckChange={handleConditionerCheckChange}
                                checkedState={conditionerCheckedState}
                            />
                        </div>
                        <div className="m-5  flex items-center justify-center text-[25px]">
                            スマートスイッチボックス
                        </div>
                        <div className="mx-10 md:mx-40">
                            <TestResultTable
                                rows={3}
                                parameters={switchCheckList}
                                points={switchCheckPoint}
                                onCheckChange={handleSwitchCheckChange}
                                checkedState={switchCheckedState}
                            />
                        </div>
                        <div className="m-5  flex items-center justify-center text-[25px]">
                            スマートAI
                        </div>
                        <div className="mx-10 md:mx-40">
                            <TestResultTable
                                rows={3}
                                parameters={smartCheckList}
                                points={smartCheckPoint}
                                onCheckChange={handleSmartCheckChange}
                                checkedState={smartCheckedState}
                            />
                        </div>
                        <div className="mx-10 md:mx-60 mt-10">
                            <TestSummaryTable
                                rows={3}
                                parameters={summaryCheckList}
                                checkedState={testSummaryTableCheckedState}
                                onCheckChange={handleTestSummaryTableCheckChange}
                            />
                        </div>
                        <div className="flex justify-between items-center mt-10 sm:mx-20 mx-0">
                            <BackBtn onClick={handleClose}>
                                戻る
                            </BackBtn>
                            <SaveButton onClick={handleSave}>
                                登録完了・提出へ
                            </SaveButton>
                        </div>
                        {isModalOpen && <RegisterCompleteModal onClose={toggleModal} />}

                    </div>
            }
        </RootLayout>
    );
};

export default Page;

