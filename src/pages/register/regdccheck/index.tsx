import DCConfirmTable from "@/components/UI/Tables/DCConfirmTable";
import GroundTable from "@/components/UI/Tables/GroundTable";
import ImageUploadComponent from "@/components/UI/ImageUploadComponent";
import RestrictTable from "@/components/UI/Tables/RestrictTable";
import SaveButton from "@/components/UI/Buttons/SaveNextSubmitBtn";
import { supabase } from "@/components/Supabase/client";
import router from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { DCTableData, RestrictTableData, TerminalVTableData } from "@/components/table.type";
import { updateUserTable } from "@/components/DataHandling";
import BackBtn from "@/components/UI/Buttons/BackBtn";
import RootLayout from "@/components/RootLayout";
import PdfContext from '@/contexts/PdfContext';
import CapacityTable from "@/components/UI/Tables/CapacityTable";
import UnitDropdown from "@/components/UI/UnitDropDown";
import TerminalVTable from "@/components/UI/Tables/TerminalVTable";


const Page = () => {

    const initialDCTableData: DCTableData = {
        maker: ['', '', '', ''],
        format: ['', '', '', ''],
        serialNumber: [1, 1, 1, 0],
        parallelNumber: [1, 1, 1, 0],
        hasConnection: [true, false],
        voltage: [1, 1, 1, 0],
    };

    const InitialRestrictValue: RestrictTableData = {
        conditionerIndependentUO: 1,
        conditionerIndependentOW: 1,
        conditionerIndependentUW: 1,
        conditionerDependentUO: 1,
        conditionerDependentOW: 1,
        conditionerDependentUW: 1,
        conditionerPM: 1,
        conditionerPE: 1,
        conditionerME: 1,
    }

    const InitialTerminalValue: TerminalVTableData = {
        terminalIndependentUO: 1,
        terminalIndependentOW: 1,
        terminalIndependentUW: 1,
        terminalDependentUO: 1,
        terminalDependentOW: 1,
        terminalDependentUW: 1,
    }


    const handleClose = () => {
        router.push('/register/regenergystorage/2');
    };

    const handleSave = async () => {

        const newInvalidFields = {
            dcConfirmTableData: !dcConfirmTableData, capacityTableData: !capacityTableData, dcdiagramImageString: !dcdiagramImageString,
            groundTableData: !groundTableData,
            restrictTableData: !restrictTableData, terminalTableData: !terminalTableData
        }

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
            router.push('/register/regsetparameter');
        }
    };

    const showErrorToast = (invalidFields: any[]) => {
        // toast.warning(`Please fill in all required fields: ${invalidFields.join(', ')}`);
        toast.warning(`すべての項目を正確に記入してください。`);
    };

    const saveDataToSupabase = async () => {

        console.log('💢💢💢')

        const { data: { user } } = await supabase.auth.getUser();
        const userID = user?.id;
        const userEmail = user?.email;
        const myUUID = localStorage.getItem('myUUID');
        const userName = user?.user_metadata ? user.user_metadata.full_name : 'Name not set';
        setIsLoading(true);
        try {
            // Save dc_makder
            const { data: dcMakerData, error: dcMakerError } = await supabase
                .from('dc_maker')
                .upsert({
                    pv1: dcConfirmTableData?.maker[0], pv2: dcConfirmTableData?.maker[1], pv3: dcConfirmTableData?.maker[2],
                    combine: dcConfirmTableData?.maker[3], user_id: userID, report_id: myUUID
                }, { onConflict: 'report_id' })
            if (dcMakerError) throw dcMakerError;

            // Save dc_format
            const { data: dcFormatData, error: dcFormatError } = await supabase
                .from('dc_format')
                .upsert({
                    pv1: dcConfirmTableData?.format[0], pv2: dcConfirmTableData?.format[1], pv3: dcConfirmTableData?.format[2],
                    combine: dcConfirmTableData?.format[3], user_id: userID, report_id: myUUID
                }, { onConflict: 'report_id' })
            if (dcFormatError) throw dcFormatError;

            // Save dc_serial
            console.log('       ', dcConfirmTableData?.serialNumber);
            const { data: dcSerialData, error: dcSerialError } = await supabase
                .from('dc_serial')
                .upsert({
                    pv1: dcConfirmTableData?.serialNumber[0], pv2: dcConfirmTableData?.serialNumber[1], pv3: dcConfirmTableData?.serialNumber[2],
                    combine: dcConfirmTableData?.serialNumber[3], user_id: userID, report_id: myUUID
                }, { onConflict: 'report_id' })
            if (dcSerialError) throw dcSerialError;

            console.log('💢')
            // Save dc_parallel
            const { data: dcParallelData, error: dcParallelError } = await supabase
                .from('dc_parallel')
                .upsert({
                    pv1: dcConfirmTableData?.parallelNumber[0], pv2: dcConfirmTableData?.parallelNumber[1],
                    pv3: dcConfirmTableData?.parallelNumber[2], combine: dcConfirmTableData?.parallelNumber[3], user_id: userID, report_id: myUUID
                },
                    { onConflict: 'report_id' })
            if (dcParallelError) throw dcParallelError;

            // Save dc_connection
            const { data: dcConnectionData, error: dcConnectionError } = await supabase
                .from('dc_connection')
                .upsert({
                    pv: dcConfirmTableData?.hasConnection[0], combine: dcConfirmTableData?.hasConnection[1], user_id: userID, report_id: myUUID
                },
                    { onConflict: 'report_id' })
            if (dcConnectionError) throw dcConnectionError;

            // Save dc_openvoltage
            const { data: dcOpenVoltageData, error: dcOpenVoltageError } = await supabase
                .from('dc_openvoltage')
                .upsert({
                    pv1: dcConfirmTableData?.voltage[0], pv2: dcConfirmTableData?.voltage[1], pv3: dcConfirmTableData?.voltage[2],
                    combine: dcConfirmTableData?.voltage[3], user_id: userID, report_id: myUUID
                },
                    { onConflict: 'report_id' })
            if (dcOpenVoltageError) throw dcOpenVoltageError;

            // Save dc_diagram
            const { data: dcDiagramData, error: dcDiagramError } = await supabase
                .from('dc_diagram')
                .upsert({
                    diagram_image_url: dcdiagramImageString ?? '', ground_value: groundTableData ?? 1, capacity_value: capacityTableData ?? 1, capacity_unit: unit ?? '',
                    user_id: userID, report_id: myUUID
                },
                    { onConflict: 'report_id' })
            if (dcDiagramError) throw dcDiagramError;

            // Save dc_terminal

            console.log('why??')
            console.log(terminalTableData)
            const { data: dcTerminalData, error: dcTerminalError } = await supabase
                .from('dc_terminal')
                .upsert({
                    alone_uo: terminalTableData?.terminalIndependentUO ?? 0, alone_ow: terminalTableData?.terminalIndependentOW ?? 0,
                    alone_uw: terminalTableData?.terminalIndependentUW ?? 0, related_uo: terminalTableData?.terminalDependentUO ?? 0,
                    related_ow: terminalTableData?.terminalDependentOW ?? 0, related_uw: terminalTableData?.terminalDependentUW ?? 0,
                    user_id: userID, report_id: myUUID
                },
                    { onConflict: 'report_id' })
            if (dcTerminalError) throw dcTerminalError;


            // Save dc_resistance
            console.log('how??')
            const { data: dcResistanceData, error: dcResistanceError } = await supabase
                .from('dc_resistance')
                .upsert({
                    alone_uo: restrictTableData?.conditionerIndependentUO ?? 0, alone_ow: restrictTableData?.conditionerIndependentOW ?? 0,
                    alone_uw: restrictTableData?.conditionerIndependentUW ?? 0, related_uo: restrictTableData?.conditionerDependentUO ?? 0,
                    related_ow: restrictTableData?.conditionerDependentOW ?? 0, related_uw: restrictTableData?.conditionerDependentUW ?? 0,
                    conditioner_uo: restrictTableData?.conditionerPM ?? 0, conditioner_ow: restrictTableData?.conditionerPE ?? 0,
                    conditioner_uw: restrictTableData?.conditionerME ?? 0, user_id: userID, report_id: myUUID
                },
                    { onConflict: 'report_id' })
            if (dcResistanceError) throw dcResistanceError;

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
        let confirmTableData = initialDCTableData;
        async function fetchData() {
            setIsLoading(true)
            try {
                // Fetch data from dc_maker
                const { data: dcMakerData, error: dcMakerError } = await supabase
                    .from('dc_maker')
                    .select()
                    .eq('report_id', myUUID)
                    .single(); // Assuming you expect only one row
                if (dcMakerError) {
                    throw dcMakerError;
                }
                if (dcMakerData) {
                    confirmTableData.maker = [dcMakerData.pv1, dcMakerData.pv2, dcMakerData.pv3, dcMakerData.combine]
                }

                // Fetch data from dc_format
                const { data: dcFormatData, error: dcFormatError } = await supabase
                    .from('dc_format')
                    .select()
                    .eq('report_id', myUUID)
                    .single(); // Assuming you expect only one row
                if (dcFormatError) {
                    throw dcFormatError;
                }
                if (dcFormatData) {
                    confirmTableData.format = [dcFormatData.pv1, dcFormatData.pv2, dcFormatData.pv3, dcFormatData.combine]
                }

                // Fetch data from dc_serial
                const { data: dcSerialData, error: dcSerialError } = await supabase
                    .from('dc_serial')
                    .select()
                    .eq('report_id', myUUID)
                    .single(); // Assuming you expect only one row
                if (dcSerialError) {
                    throw dcSerialError;
                }
                if (dcSerialData) {
                    confirmTableData.serialNumber = [dcSerialData.pv1, dcSerialData.pv2, dcSerialData.pv3, dcSerialData.combine]
                }

                // Fetch data from dc_parallel
                const { data: dcParallelData, error: dcParallelError } = await supabase
                    .from('dc_parallel')
                    .select()
                    .eq('report_id', myUUID)
                    .single(); // Assuming you expect only one row
                if (dcParallelError) {
                    throw dcParallelError;
                }
                if (dcParallelData) {
                    confirmTableData.parallelNumber = [dcParallelData.pv1, dcParallelData.pv2, dcParallelData.pv3, dcParallelData.combine]
                }

                // Fetch data from dc_connection
                const { data: dcConnectionData, error: dcConnectionError } = await supabase
                    .from('dc_connection')
                    .select()
                    .eq('report_id', myUUID)
                    .single(); // Assuming you expect only one row
                if (dcConnectionError) {
                    throw dcConnectionError;
                }
                if (dcConnectionData) {
                    confirmTableData.hasConnection = [dcConnectionData.pv, dcConnectionData.combine]
                }

                // Fetch data from dc_openvoltage
                const { data: dcOpenVoltageData, error: dcOpenVoltageError } = await supabase
                    .from('dc_openvoltage')
                    .select()
                    .eq('report_id', myUUID)
                    .single(); // Assuming you expect only one row
                if (dcOpenVoltageError) {
                    throw dcOpenVoltageError;
                }
                if (dcOpenVoltageData) {
                    confirmTableData.voltage = [dcOpenVoltageData.pv1, dcOpenVoltageData.pv2, dcOpenVoltageData.pv3, dcOpenVoltageData.combine]
                }

                // Fetch data from dc_diagram
                const { data: dcDiagramData, error: dcDiagramError } = await supabase
                    .from('dc_diagram')
                    .select()
                    .eq('report_id', myUUID)
                    .single(); // Assuming you expect only one row
                if (dcDiagramError) {
                    throw dcDiagramError;
                }
                if (dcDiagramData) {
                    setDCDiagramImageString(dcDiagramData.diagram_image_url);
                    setGroundTableData(dcDiagramData.ground_value);
                    setCapacityTableData(dcDiagramData.capacity_value);
                    setUnit(dcDiagramData.capacity_unit)
                }

                // Fetch data from dc_terminal
                const { data: dcTerminalData, error: dcTerminalError } = await supabase
                    .from('dc_terminal')
                    .select()
                    .eq('report_id', myUUID)
                    .single(); // Assuming you expect only one row
                if (dcTerminalError) {
                    throw dcTerminalError;
                }
                if (dcTerminalData) {

                    const TerminalData: TerminalVTableData | undefined = {
                        terminalIndependentUO: dcTerminalData.alone_uo,
                        terminalIndependentOW: dcTerminalData.alone_ow,
                        terminalIndependentUW: dcTerminalData.alone_uw,
                        terminalDependentUO: dcTerminalData.related_uo,
                        terminalDependentOW: dcTerminalData.related_ow,
                        terminalDependentUW: dcTerminalData.related_uw,
                    };
                    setTerminalTableData(TerminalData);
                }


                // Fetch data from dc_resistance
                const { data: dcResistanceData, error: dcResistanceError } = await supabase
                    .from('dc_resistance')
                    .select()
                    .eq('report_id', myUUID)
                    .single(); // Assuming you expect only one row
                if (dcResistanceError) {
                    throw dcResistanceError;
                }
                if (dcResistanceData) {

                    const RestrictData: RestrictTableData | undefined = {
                        conditionerIndependentUO: dcResistanceData.alone_uo,
                        conditionerIndependentOW: dcResistanceData.alone_ow,
                        conditionerIndependentUW: dcResistanceData.alone_uw,
                        conditionerDependentUO: dcResistanceData.related_uo,
                        conditionerDependentOW: dcResistanceData.related_ow,
                        conditionerDependentUW: dcResistanceData.related_uw,
                        conditionerPM: dcResistanceData.conditioner_uo,
                        conditionerPE: dcResistanceData.conditioner_ow,
                        conditionerME: dcResistanceData.conditioner_uw
                    };
                    setRestrictTableData(RestrictData);
                    setIsNew(false);
                }
                setDCConfirmTableData(confirmTableData)
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
        setPdfName('4.pdf');
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
    const [dcConfirmTableData, setDCConfirmTableData] = useState<DCTableData>(initialDCTableData);
    const [dcdiagramImageString, setDCDiagramImageString] = useState('');
    const [groundTableData, setGroundTableData] = useState<number>(1);
    const [capacityTableData, setCapacityTableData] = useState<number>(1);
    const [restrictTableData, setRestrictTableData] = useState<RestrictTableData | undefined>(InitialRestrictValue);
    const [terminalTableData, setTerminalTableData] = useState<TerminalVTableData | undefined>(InitialTerminalValue);


    const [unit, setUnit] = useState('kVA');

    const handleUnitChange = (newUnit: string) => {
        setUnit(newUnit);
        // Additional logic for handling unit change
    };



    const handleDCConfirmTableDataChange = (updatedData: DCTableData) => {
        setDCConfirmTableData(updatedData);
    };

    const handleCapacityTableDataChange = (value: number) => {
        setCapacityTableData(value);
    };

    const handleDCDiagramImageChange = (newString: string) => {
        setDCDiagramImageString(newString);
    };

    const handleRestrictTableDataChange = (updatedData: RestrictTableData | undefined) => {
        setRestrictTableData(updatedData);
    };

    const handleTerminalTableDataChange = (updatedData: TerminalVTableData | undefined) => {
        setTerminalTableData(updatedData);
    };

    const handleGroundTableDataChange = (value: number) => {
        setGroundTableData(value);
    };

    const smartBaseOptions = [
        { id: "smartbase-1", label: "使用：N（スマートベース）" },
        { id: "smartbase-2", label: "使用：H（嵩上げ架台）" },
        { id: "smartbase-3", label: "使用なし" },
        // Add more options as needed
    ];

    const saltProtectOptions = [
        { id: "saltprotect-1", label: "使用" },
        { id: "saltprotect-2", label: "使用なし" },
    ];


    return (
        <RootLayout>
            {
                isLoading ?
                    <>読み込み中...</> :
                    <div className="m-10">
                        <p className=" mt-12 text-[30px] flex justify-center mb-5">
                            ④回路・単線結線図
                        </p>
                        <p className=" mt-12 text-[25px] flex justify-center">
                            ※「個別入力」か「一括入力」のいずれかを選択し、チェックを入れてください。
                        </p>
                        <p className=" mt-12 text-[25px] flex justify-center">
                            直流回路の施工確認　※PID非対応パネルまたは蓄電システム設置前の発電量低下について、当社による責任は負えません。
                        </p>
                        <div className=" flex justify-center text-[25px] m-5">
                            ※未記入の場合、電圧の妥当性が確認できず、アフター対応時の調査に時間を要します。
                        </div>
                        <div className="mt-5 mx-32">
                            <DCConfirmTable
                                data={dcConfirmTableData ?? initialDCTableData}
                                onDataChange={handleDCConfirmTableDataChange}
                            />
                            <div className="flex justify-center items-center my-16">
                                <CapacityTable
                                    onInputChange={handleCapacityTableDataChange}
                                    value={capacityTableData} // Pass the state as a prop
                                />
                                <div className="ml-5">
                                    <UnitDropdown value={unit} onChange={handleUnitChange} />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <div className=" flex justify-center text-[25px] m-5">
                                単線結線図
                            </div>
                            <div className=" flex justify-center text-[25px] m-2">
                                電力申請時の回路図または手書きの単線図を添付して下さい。
                            </div>
                            <div className=" flex justify-center text-[15px] m-2">
                                ①蓄電システムの機器、②ブレーカ種類、③容量を必ず記入して下さい。
                            </div>
                            <div className="flex justify-center">
                                <ImageUploadComponent
                                    width={800}
                                    height={400}
                                    dragDropText="※電力申請時の回路図の写真データなどを添付"
                                    onImageParseStringChange={handleDCDiagramImageChange}
                                    imageSrc={dcdiagramImageString}
                                />
                            </div>
                        </div>
                        <div className=" mt-12 flex flex-col justify-center">
                            <div className=" flex justify-center text-[25px] m-5">
                                交流系の端子電圧の測定
                            </div>
                            <div className="flex justify-center">
                                <TerminalVTable
                                    onDataChange={handleTerminalTableDataChange}
                                    data={terminalTableData} // Pass the state as a prop
                                />
                            </div>
                        </div>
                        <div className=" mt-12 flex flex-col justify-center">
                            <div className=" flex justify-center text-[25px] m-5">
                                接地抵抗・絶縁抵抗・入出力電圧　測定
                            </div>
                            <div className="flex justify-center">
                                <GroundTable
                                    onInputChange={handleGroundTableDataChange}
                                    value={groundTableData} // Pass the state as a prop
                                />
                            </div>
                        </div>
                        <div className=" mt-12 flex flex-col justify-center">
                            <div className=" flex justify-center text-[25px] mt-5">
                                絶縁抵抗測定(線間）
                            </div>
                            <div className=" flex justify-center text-[25px] m-5">
                                ※絶縁抵抗を測定する場合は必ず電池側の端子を外してから実施して下さい。
                            </div>
                            <div className="flex justify-center">
                                <RestrictTable
                                    onDataChange={handleRestrictTableDataChange}
                                    data={restrictTableData} // Pass the state as a prop
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

