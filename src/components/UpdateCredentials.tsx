import React, { useEffect, useState } from 'react';
import { supabase } from "@/components/Supabase/client";

import ProfileInputField from './UI/ProfileInputField';
import { isValidEmail } from './util';
import router from 'next/router';

const UpdateCredentials: React.FC = () => {
    const [newPassword, setNewPassword] = useState<string>('');
    const [newEmail, setNewEmail] = useState<string>('');

    const [companyName, setCompanyName] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [constructID, setConstructID] = useState<string>('');
    const [ownerName, setOwnerName] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [validationMessages, setValidationMessages] = useState({
        companyName: '',
        address: '',
        phoneNumber: '',
        constructID: '',
        ownerName: '',
        newEmail: '',
        newPassword: '',
    });

    useEffect(() => {
        // Fetch profile data when the component mounts
        const fetchProfile = async () => {
            setLoading(true);

            const {
                data: { session }, error: sdf
            } = await supabase.auth.getSession();

            if (sdf) {
                console.log(sdf)
            }

            console.log(session)

            if (!session) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('profile')
                .select('*')
                .eq('user_id', session?.user.id)
                .single();
            console.log(session?.user.id)
            console.log(data)
            if (error) {
                setLoading(false);
            } else {
                // Assuming that `data` contains all the fields
                setCompanyName(data.company_name || '');
                setAddress(data.address || '');
                setPhoneNumber(data.phone_number || '');
                setConstructID(data.construction_id || '');
                setOwnerName(data.owner_name || '');
                setNewEmail(data.email || '');
            }
            console.log("phone::", data.phone_number)
            setLoading(false);
        };

        fetchProfile();
    }, [supabase]);

    const validateInputs = () => {
        let isValid = true;
        let errors = {
            companyName: '',
            address: '',
            phoneNumber: '',
            constructID: '',
            ownerName: '',
            newEmail: '',
            newPassword: '',
        };

        console.log("companyName", companyName);

        if (!companyName) {
            isValid = false;
            errors.companyName = '会社名を空にすることはできません。';
        }
        if (!address) {
            console.log("QQQQQ")
            isValid = false;
            errors.address = 'アドレスを空にすることはできません。';
        }
        if (!phoneNumber) {
            console.log("QQQQQ")
            isValid = false;
            errors.phoneNumber = '電話番号を空白にすることはできません。';
        }
        if (!constructID) {
            console.log("QQQQQ")
            isValid = false;
            errors.constructID = '施工ID認定番号を空白にすることはできません。';
        }
        if (!ownerName) {
            console.log("QQQQQ")
            isValid = false;
            errors.ownerName = '施工IDカード所持者氏名を空白にすることはできません。';
        }
        if (!newEmail) {
            console.log("QQQQQ")
            isValid = false;
            errors.newEmail = 'Eメールを空にすることはできません。';
        }
        else if (!isValidEmail(newEmail)) {
            console.log("QQQQQ")
            isValid = false;
            errors.newEmail = 'Eメールは検証される必要があります。'
        }
        if (!newPassword) {
            console.log("QQQQQ")
            isValid = false;
            errors.newPassword = '新しいパスワードを空にすることはできません。'
        }

        console.log(errors)
        setValidationMessages(errors);
        return isValid;
    };

    const UpdateandRegisterProfile = async () => {

        if (!validateInputs()) {
            return;
        }
        setLoading(true);

        console.log("UpdateClicked")
        const {
            data: { session },
        } = await supabase.auth.getSession();

        console.log("Isuser", session)
        if (!session) {
            setLoading(false);
            return;
        }
        // Update new password
        const { error: authError } = await supabase.auth.updateUser({ password: newPassword, email: newEmail });
        if (authError) {
            console.log("authError", authError)
            setLoading(false);
            return;
        }

        const updates = {
            user_id: session?.user.id,
            company_name: companyName,
            email: newEmail,
            address: address,
            phone_number: phoneNumber,
            construction_id: constructID,
            owner_name: ownerName,
            updated_at: new Date(),
        };

        console.log('before saving in profile table')

        console.log(updates)

        const { data: profileData, error: profileError } = await supabase
            .from('profile')
            .upsert(updates, {
                onConflict: 'user_id',
            });

        if (profileError) {
            console.log(profileError);
            setLoading(false);
            return;
        }

        console.log('after saving in profile table')
        setLoading(false);
        router.push('/home');
    };

    return (
        <div className="flex justify-center items-center h-screen">

            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-5/6 lg:w-1/3">

                <ProfileInputField
                    id="companyName"
                    label="会社名"
                    placeholder="会社名を入力してください"
                    value={companyName}
                    onChange={setCompanyName}
                    validationMessage={validationMessages.companyName}
                />
                <ProfileInputField
                    id="AdDress"
                    label="住所"
                    placeholder="住所を入力してください"
                    value={address}
                    onChange={setAddress}
                    validationMessage={validationMessages.address}
                />
                <ProfileInputField
                    id="PhoneNumber"
                    label="電話番号"
                    placeholder="電話番号を入力してください"
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    validationMessage={validationMessages.phoneNumber}
                />
                <ProfileInputField
                    id="CosntructID"
                    label="施工ID認定番号"
                    placeholder="施工ID認定番号を入力してください"
                    value={constructID}
                    onChange={setConstructID}
                    validationMessage={validationMessages.constructID}
                />
                <ProfileInputField
                    id="OwnerName"
                    label="施工IDカード所持者氏名"
                    placeholder="施工IDカード所持者氏名を入力してください"
                    value={ownerName}
                    onChange={setOwnerName}
                    validationMessage={validationMessages.ownerName}
                />

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="NewEmail">
                        新しいメール
                    </label>
                    <input
                        id="NewEmail"
                        type="email"
                        placeholder="新しいメールを入力してください"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                    />
                    {validationMessages.newEmail && <p className="text-red-500 text-sm italic">{validationMessages.newEmail}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="new-password">
                        新しいパスワード
                    </label>
                    <input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="新しいパスワードを入力してください"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    {validationMessages.newPassword && <p className="text-red-500 text-sm italic">{validationMessages.newPassword}</p>}

                </div>
                <div className="mb-4">
                    <label className="inline-flex items-center">
                        <input type="checkbox" className="form-checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                        <span className="ml-2 text-sm text-gray-600">パスワードを表示</span>
                    </label>
                </div>

                <button
                    onClick={UpdateandRegisterProfile}
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    プロフィールを更新
                </button>
                {/* {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>} */}
            </div>
        </div>
    );
};

export default UpdateCredentials;
