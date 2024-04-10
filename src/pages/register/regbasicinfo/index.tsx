import { updateUserTable } from "@/components/DataHandling";
import RootLayout from "@/components/RootLayout";
import { supabase } from "@/components/Supabase/client";
import BackBtn from "@/components/UI/Buttons/BackBtn";
import CheckboxComponent from "@/components/UI/CheckBox";
import CustomInput from "@/components/UI/CustomInput";
import RadioButtonList from "@/components/UI/RadioButton";
import SaveButton from "@/components/UI/Buttons/SaveNextSubmitBtn";
import PdfContext from '@/contexts/PdfContext';

import router from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import JaDatePicker from "@/components/UI/JaDatePicker";
import { toggleElement } from "@/components/util";
const Page = () => {

    const handleClose = () => {
        router.push('/home');
    };

    const handleSave = async () => {

        const newInvalidFields = {
            createYear: !createYear, createMonth: !createMonth, createDate: !createDate, clientName: !clientName, clientAdress: !clientAdress,
            clientPhone: !clientPhone, constructName: !constructName,
            constructAdress: !constructAdress, constructPhone: !constructPhone, constructIDNumber: !constructIDNumber,
            constructIDOwner: !constructIDOwner, completeYear: !completeYear, completeMonth: !completeMonth, completeDate: !completeDate,
            powerConditioner: !powerConditioner, swithcBox: !swithcBox, controlUnit: !controlUnit, batteryUnitOne: !batteryUnitOne,
            batteryUnitTwo: !batteryUnitTwo, batteryUnitThree: !batteryUnitThree, coverAcc: !coverAcc, measureUnit: !measureUnit,
            hemsController: !hemsController, sentPlace: !sentPlace, smartBase: !smartBase, saltprotection: !saltprotection,
            // Conditional validation for sales-related fields if toSendSmartSolar is false
            salesName: isSmartSolar ? false : !salesName,
            salesAdress: isSmartSolar ? false : !salesAdress,
            salesPhone: isSmartSolar ? false : !salesPhone,
        };

        console.log("newInvalidField", newInvalidFields)
        const isAnyFieldInvalid = Object.values(newInvalidFields).some(value => value);
        if (isAnyFieldInvalid) {
            const invalidFieldNames = Object.entries(newInvalidFields)
                .filter(([_, value]) => value)
                .map(([key, _]) => key);
            showErrorToast(invalidFieldNames);
        } else {
            // Save data and navigate if all fields are valid
            await saveDataToSupabase();
            router.push('/register/regenergystorage/1');
        }
    };

    const showErrorToast = (invalidFields: any[]) => {
        toast.warning(`すべての項目を正確に記入してください。`);
    };

    const saveDataToSupabase = async () => {

        const { data: { user } } = await supabase.auth.getUser();
        const userID = user?.id;
        const userEmail = user?.email;
        console.log(userEmail);
        const userName = user?.user_metadata ? user.user_metadata.full_name : 'Name not set';
        const myUUID = localStorage.getItem('myUUID');

        setIsLoading(true);

        try {
            // Save create_date
            const { data: createDateData, error: createDateError } = await supabase
                .from('create_date')
                .upsert({ year: createYear, month: createMonth, date: createDate, user_id: userID, report_id: myUUID }, { onConflict: 'report_id' })
            if (createDateError) throw createDateError;

            // Save client_basic_info
            const { data: clientInfoData, error: clientInfoError } = await supabase
                .from('client_basic_info')
                .upsert({ name: clientName, address: clientAdress, phone: clientPhone, user_id: userID, report_id: myUUID }, { onConflict: 'report_id' })
            if (clientInfoError) throw clientInfoError;

            // Save sales_basic_info
            const { data: salesInfoData, error: salesInfoError } = await supabase
                .from('sales_basic_info')
                .upsert({ name: salesName, address: salesAdress, phone: salesPhone, is_smart_solor: isSmartSolar,  user_id: userID, report_id: myUUID }, { onConflict: 'report_id' })
            if (salesInfoError) throw salesInfoError;

            // Save construct_basic_info
            const { data: constructInfoData, error: constructInfoError } = await supabase
                .from('construct_basic_info')
                .upsert({
                    name: constructName, address: constructAdress, phone: constructPhone, id_number: constructIDNumber,
                    id_owner: constructIDOwner, user_id: userID, report_id: myUUID
                }, { onConflict: 'report_id' })
            if (constructInfoError) throw constructInfoError;

            // Save complete_date
            const { data: completeDateData, error: completeDateError } = await supabase
                .from('complete_date')
                .upsert({ year: completeYear, month: completeMonth, date: completeDate, user_id: userID, report_id: myUUID }, { onConflict: 'report_id' })
            if (completeDateError) throw completeDateError;

            // Save product_info
            const { data: productInfoData, error: productInfoError } = await supabase
                .from('product_info')
                .upsert({
                    power_conditioner: powerConditioner, switch_box: swithcBox, control_unit: controlUnit,
                    battery_unit_one: batteryUnitOne, battery_unit_two: batteryUnitTwo, battery_unit_three: batteryUnitThree,
                    cover_acc: coverAcc, measure_unit: measureUnit, hems_controller: hemsController, sent_place: sentPlace, smart_base: smartBase,
                    salt_protection: saltprotection, user_id: userID, report_id: myUUID
                }, { onConflict: 'report_id' })
            if (productInfoError) throw productInfoError;

            console.log(sendToClient);

            // Save user_table
            updateUserTable({
                userID: userID,
                userEmail: userEmail,
                userName: userName,
                myUUID: myUUID,
                progress: "処理中..", // Translates to "Processing.."
                toClient: sendToClient,
                toSales: sendToSales,
                toConstruct: sendToConstruct,
                client_name: clientName,
                sales_name: salesName,
                construct_name: constructName,
                address: clientAdress,
                create_date: createdDate,
                complete_date: completedDate,
                shouldIncrementStage: isNew,
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
        setIsLoading(true)
        async function fetchData() {
            try {

                // Fetch data from create_date
                const { data: CreateDateData, error: CreateDateError } = await supabase
                    .from('create_date')
                    .select()
                    .eq('report_id', myUUID)
                    .single(); // Assuming you expect only one row
                if (CreateDateData) {
                    setCreateYear(CreateDateData.year);
                    setCreateMonth(CreateDateData.month);
                    setCreateDate(CreateDateData.date);
                }
                console.log('final data')
                // Fetch data from client_basic_info
                const { data: ClientInfoData, error: ClientInfoError } = await supabase
                    .from('client_basic_info')
                    .select()
                    .eq('report_id', myUUID)
                    .single(); // Assuming you expect only one row
                if (ClientInfoData) {
                    setClientName(ClientInfoData.name);
                    setClientAdress(ClientInfoData.address);
                    setClientPhone(ClientInfoData.phone);
                }

                // Fetch data from sales_basic_info
                const { data: SalesInfoData, error: SalesInfoError } = await supabase
                    .from('sales_basic_info')
                    .select()
                    .eq('report_id', myUUID)
                    .single(); // Assuming you expect only one row
                if (SalesInfoData) {
                    setSalesName(SalesInfoData.name);
                    setSalesAdress(SalesInfoData.address);
                    setSalesPhone(SalesInfoData.phone);
                    SetIsSmartSolar(SalesInfoData.is_smart_solor);
                }

                // Fetch data from Profile
                const {
                    data: { session }, error: sessionError
                } = await supabase.auth.getSession();

                const { data: ConstructData, error } = await supabase
                    .from('profile')
                    .select('*')
                    .eq('user_id', session?.user.id)
                    .single();
                console.log(session?.user.id)
                console.log(ConstructData)

                if (ConstructData) {
                    setConstructName(ConstructData.company_name);
                    setConstructAdress(ConstructData.address);
                    setConstructPhone(ConstructData.phone_number);
                    setConstructIDNumber(ConstructData.construction_id);
                    setConstructIDOwner(ConstructData.owner_name);
                }

                // Fetch data from complete_date
                const { data: CompleteDateData, error: CompleteDateError } = await supabase
                    .from('complete_date')
                    .select()
                    .eq('report_id', myUUID)
                    .single(); // Assuming you expect only one row
                if (CompleteDateData) {
                    setCompleteYear(CompleteDateData.year);
                    setCompleteMonth(CompleteDateData.month);
                    setCompleteDate(CompleteDateData.date);
                }

                // Fetch data from product_info
                const { data: ProductInfoData, error: ProductInfoError } = await supabase
                    .from('product_info')
                    .select()
                    .eq('report_id', myUUID)
                    .single(); // Assuming you expect only one row
                if (ProductInfoData) {
                    setPowerConditioner(ProductInfoData.power_conditioner);
                    setSwitchBox(ProductInfoData.switch_box);
                    setControlUnit(ProductInfoData.control_unit);
                    setBatteryUnitOne(ProductInfoData.battery_unit_one);
                    setBatteryUnitTwo(ProductInfoData.battery_unit_two);
                    setBatteryUnitThree(ProductInfoData.battery_unit_three);
                    setCoverAcc(ProductInfoData.cover_acc);
                    setMeasureUnit(ProductInfoData.measure_unit);
                    setHEMSController(ProductInfoData.hems_controller);
                    setSentPlace(ProductInfoData.sent_place);
                    switch (ProductInfoData.sent_place) {
                        case sentPlaceOption[0].id:
                            SetSendToClient(true);
                            SetSendToSales(false);
                            SetSendToConstruct(false);
                            break;
                        case sentPlaceOption[1].id:
                            SetSendToClient(false);
                            SetSendToSales(true);
                            SetSendToConstruct(false);
                            break;
                        case sentPlaceOption[2].id:
                            SetSendToClient(false);
                            SetSendToSales(false);
                            SetSendToConstruct(true);
                            break;
                        default:
                            break;
                    }
                    setSmartBase(ProductInfoData.smart_base);
                    setSaltProtection(ProductInfoData.salt_protection);
                    setIsNew(false);
                }
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        setPdfName('1.pdf');
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

    // create date
    const [createYear, setCreateYear] = useState<number>();
    const [createMonth, setCreateMonth] = useState<number>();
    const [createDate, setCreateDate] = useState<number>();
    // client information
    const [clientName, setClientName] = useState<string>('');
    const [clientAdress, setClientAdress] = useState<string>('');
    const [clientPhone, setClientPhone] = useState<string>('');
    // sales company information
    const [salesName, setSalesName] = useState<string>('');
    const [salesAdress, setSalesAdress] = useState<string>('');
    const [salesPhone, setSalesPhone] = useState<string>('');
    // construction company information
    const [constructName, setConstructName] = useState<string>('');
    const [constructAdress, setConstructAdress] = useState<string>('');
    const [constructPhone, setConstructPhone] = useState<string>('');
    const [constructIDNumber, setConstructIDNumber] = useState<string>('');
    const [constructIDOwner, setConstructIDOwner] = useState<string>('');
    // complete date
    const [completeYear, setCompleteYear] = useState<number>();
    const [completeMonth, setCompleteMonth] = useState<number>();
    const [completeDate, setCompleteDate] = useState<number>();
    // product information
    const [powerConditioner, setPowerConditioner] = useState<string>('');
    const [swithcBox, setSwitchBox] = useState<string>('');
    const [controlUnit, setControlUnit] = useState<string>('');
    const [batteryUnitOne, setBatteryUnitOne] = useState<string>('');
    const [batteryUnitTwo, setBatteryUnitTwo] = useState<string>('');
    const [batteryUnitThree, setBatteryUnitThree] = useState<string>('');
    const [coverAcc, setCoverAcc] = useState<string>('');
    const [measureUnit, setMeasureUnit] = useState<string>('');
    const [hemsController, setHEMSController] = useState<string>('');

    // sending infomation
    const [sendToClient, SetSendToClient] = useState<boolean>(false);
    const [sendToSales, SetSendToSales] = useState<boolean>(false);
    const [sendToConstruct, SetSendToConstruct] = useState<boolean>(false);

    const [sentPlace, setSentPlace] = useState<string>('');
    const [smartBase, setSmartBase] = useState<string>('smartbase-1');
    const [saltprotection, setSaltProtection] = useState<string>('saltprotect-2');

    // create date
    const [createdDate, setCreatedDate] = useState<Date>(new Date());

    useEffect(() => {
        if (createYear !== undefined && createMonth !== undefined && createDate !== undefined) {
            setCreatedDate(new Date(createYear, createMonth - 1, createDate));
        }
    }, [createYear, createMonth, createDate]);

    const handleCreateDateChange = (date: Date) => {
        setCreateYear(date.getFullYear());
        setCreateMonth(date.getMonth() + 1); // Adjust for 0-indexing
        setCreateDate(date.getDate());
    };

    // client information
    const handleClientNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClientName(event.target.value);
    };
    const handleClientAdressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClientAdress(event.target.value);
    };
    const handleClientPhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClientPhone(event.target.value);
    };
    // sales company information
    const handleSalesNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSalesName(event.target.value);
    };
    const handleSalesAdressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSalesAdress(event.target.value);
    };
    const handleSalesPhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSalesPhone(event.target.value);
    };
    // construction company information
    const handleConstructionNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConstructName(event.target.value);
    };
    const handleConstructiontAdressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConstructAdress(event.target.value);
    };
    const handleConstructionPhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConstructPhone(event.target.value);
    };
    const handleConstructionIDNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConstructIDNumber(event.target.value);
    };
    const handleConstructionIDOwner = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConstructIDOwner(event.target.value);
    };
    // complete date
    const [completedDate, setCompletedDate] = useState<Date>(new Date());

    useEffect(() => {
        if (completeYear !== undefined && completeMonth !== undefined && completeDate !== undefined) {
            setCompletedDate(new Date(completeYear, completeMonth - 1, completeDate));
        }
    }, [completeYear, completeMonth, completeDate]);

    const handleComopleteDateChange = (date: Date) => {
        setCompleteYear(date.getFullYear());
        setCompleteMonth(date.getMonth() + 1); // Adjust for 0-indexing
        setCompleteDate(date.getDate());
    };

    //sending check
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("Checkbox status:", event.target.checked ? "Checked" : "Unchecked");
        // Additional actions here
    };

    // product information
    const handlepowerConditionerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPowerConditioner(event.target.value);
    };
    const handleSwitchBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSwitchBox(event.target.value);
    };
    const handleControlUnitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setControlUnit(event.target.value);
    };
    const handleBatteryUnitOneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBatteryUnitOne(event.target.value);
    };
    const handleBatteryUnitTwoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBatteryUnitTwo(event.target.value);
    };
    const handleBatteryUnitThreeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBatteryUnitThree(event.target.value);
    };
    const handleCoverAccChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCoverAcc(event.target.value);
    };
    const handleMeasureUnitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMeasureUnit(event.target.value);
    };
    const handleHEMSControllerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHEMSController(event.target.value);
    };

    const handleSentPlaceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSentPlace(event.target.id);
        switch (event.target.id) {
            case sentPlaceOption[0].id:
                SetSendToClient(true);
                SetSendToSales(false);
                SetSendToConstruct(false);
                break;
            case sentPlaceOption[1].id:
                SetSendToClient(false);
                SetSendToSales(true);
                SetSendToConstruct(false);
                break;

            case sentPlaceOption[2].id:
                SetSendToClient(false);
                SetSendToSales(false);
                SetSendToConstruct(true);
                break;
            default:
                break;
        }
    };

    const handleSmartBaseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSmartBase(event.target.id);
    };
    const handleSaltProtectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSaltProtection(event.target.id)
    };

    const sentPlaceOption = [
        { id: "sentplace-1", label: "お客様" },
        { id: "sentplace-2", label: "販売会社" },
        { id: "sentplace-3", label: "施工会社" },
    ];

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

    const [isSmartSolar, SetIsSmartSolar] = useState<boolean>(false);

    const handleIsSmartSolarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        SetIsSmartSolar(event.target.checked);
        toggleElement();
    };


    return (
        <RootLayout>
            {
                isLoading ?
                    <>読み込み中...</> :
                    <div className="m-10">
                        <div className="flex items-center justify-end">
                            <p className=" m-5 text-[20px]">
                                作成日
                            </p>
                            {/* ... create date ... */}
                            <JaDatePicker selectedDate={createdDate} onDateChange={handleCreateDateChange} />
                        </div>
                        <div className=" flex justify-center text-[30px] mb-5">
                            ①基本情報
                        </div>

                        <div className=" flex justify-center text-[25px]">
                            ハイブリッドシステム　設置完了報告書 謙 保証申請書
                        </div>
                        <div className="m-3 flex justify-center text-[25px]">
                            以下の通り、不備なく設置完了したことを報告いたします
                        </div>

                        <div className="flex justify-around flex-col lg:flex-row">
                            <div className="mx-5">
                                <div className="m-2 text-[25px]">
                                    【お客様情報】
                                </div>
                                {/* ... client info ... */}
                                <CustomInput
                                    title="お客様"
                                    value={clientName}
                                    handleChange={handleClientNameChange}
                                />
                                <CustomInput
                                    title="住所"
                                    value={clientAdress}
                                    handleChange={handleClientAdressChange}
                                />
                                <CustomInput
                                    title="電話番号"
                                    value={clientPhone}
                                    handleChange={handleClientPhoneChange}
                                />
                            </div>

                            <div className="mx-5">
                                <div className="m-2 text-[25px]">
                                    【販売会社情報】
                                </div>
                                {/* ... sales company info ... */}
                                <CustomInput
                                    title="会社名"
                                    value={salesName}
                                    disabled={isSmartSolar}
                                    handleChange={handleSalesNameChange}
                                />
                                <CustomInput
                                    title="住所"
                                    value={salesAdress}
                                    disabled={isSmartSolar}
                                    handleChange={handleSalesAdressChange}
                                />
                                <CustomInput
                                    title="会社電話番号"
                                    value={salesPhone}
                                    disabled={isSmartSolar}
                                    handleChange={handleSalesPhoneChange}
                                />
                            <CheckboxComponent id="checkbox-1" label="スマートソーラー" checkedStatus={isSmartSolar}
                                onCheckboxChange={handleIsSmartSolarChange}
                            />
                            </div>

                            <div className="mx-5">
                                <div className="m-2 text-[25px]">
                                    【施工会社情報】
                                </div>
                                {/* ... construction company info ... */}
                                <CustomInput
                                    title="会社名"
                                    value={constructName}
                                    handleChange={handleConstructionNameChange}
                                />
                                <CustomInput
                                    title="住所"
                                    value={constructAdress}
                                    handleChange={handleConstructiontAdressChange}
                                />
                                <CustomInput
                                    title="会社電話番号"
                                    value={constructPhone}
                                    handleChange={handleConstructionPhoneChange}
                                />
                                <CustomInput
                                    title="施工ID認定番号"
                                    value={constructIDNumber}
                                    handleChange={handleConstructionIDNumber}
                                />
                                <CustomInput
                                    title="施工IDカード所持者氏名"
                                    value={constructIDOwner}
                                    handleChange={handleConstructionIDOwner}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-center">
                            <div className="text-[20px] m-5">
                                保証書送付先
                            </div>
                            <RadioButtonList options={sentPlaceOption} onRadioChange={handleSentPlaceChange} optionString={sentPlace} />
                        </div>

                        <div className="flex items-center justify-center">

                            <p className=" m-5 text-[20px]">
                                工事完了日
                            </p>
                            {/* ... complete date ... */}
                            <JaDatePicker selectedDate={completedDate} onDateChange={handleComopleteDateChange} />
                        </div>

                        <div className="mt-2 text-[20px] text-center">
                            [添付必要書類]　※保証書発行に必ず必要です
                        </div>

                        <div className="mt-2 text-[20px] text-center">
                            ⚫設置状況写真・・・機器の設置状況に問題が無いか確認します
                        </div>

                        <div className="mt-2 text-[20px] text-center">
                            ⚫各機器シリアル番号写真・・・出荷機器と相違が無いか確認します
                        </div>

                        <div className="mt-2 text-[20px] text-center">
                            ⚫竣工検査チェックリスト・・・機器の設定及び工事が正常に完了しているか確認します
                        </div>

                        <div className="flex flex-col items-center mx-[30px] mt-5">
                            <div className="m-2 text-[25px]">
                                【製品情報】
                            </div>
                            <div className="flex justify-end text-[20px]">
                                (※シリアルNO.は機器、及び梱包箱をご確認ください)
                            </div>
                            {/* ... produce info ... */}
                            <CustomInput
                                title="パワーコンディショナ"
                                value={powerConditioner}
                                handleChange={handlepowerConditionerChange}
                            />
                            <CustomInput
                                title="スマートスイッチボックス"
                                value={swithcBox}
                                handleChange={handleSwitchBoxChange}
                            />
                            <CustomInput
                                title="蓄電池 (コントロールユニット)"
                                value={controlUnit}
                                handleChange={handleControlUnitChange}
                            />
                            <CustomInput
                                title="蓄電池 (電池ユニット①)"
                                value={batteryUnitOne}
                                handleChange={handleBatteryUnitOneChange}
                            />
                            <CustomInput
                                title="蓄電池 (電池ユニット②)"
                                value={batteryUnitTwo}
                                handleChange={handleBatteryUnitTwoChange}
                            />
                            <CustomInput
                                title="蓄電池 (電池ユニット③)"
                                value={batteryUnitThree}
                                handleChange={handleBatteryUnitThreeChange}
                            />
                            <CustomInput
                                title="蓄電池 (カバー・アクセサリ)"
                                value={coverAcc}
                                handleChange={handleCoverAccChange}
                            />
                            <CustomInput
                                title="スマートAI (測定ユニット)"
                                value={measureUnit}
                                handleChange={handleMeasureUnitChange}
                            />
                            <CustomInput
                                title="スマートAI (HEMSコントローラ)"
                                value={hemsController}
                                handleChange={handleHEMSControllerChange}
                            />
                            <div className="flex items-center justify-end mt-5">
                                <div className="text-[20px] m-5">
                                    スマートベース
                                </div>
                                <RadioButtonList options={smartBaseOptions} onRadioChange={handleSmartBaseChange} optionString={smartBase} />
                            </div>
                            <div className="flex items-center justify-end mt-5">
                                <div className="text-[20px] m-5">
                                    重塩害カバー
                                </div>
                                <RadioButtonList options={saltProtectOptions} onRadioChange={handleSaltProtectionChange} optionString={saltprotection} />
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-10 sm:mx-20 mx-0">
                            <BackBtn onClick={handleClose}>
                                戻る
                            </BackBtn>
                            <SaveButton onClick={handleSave}>
                                保存・次頁へ
                            </SaveButton>
                        </div>
                    </div>
            }
        </RootLayout>
    );
};

export default Page;
