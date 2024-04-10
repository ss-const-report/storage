import React, { useEffect, useState } from 'react';
import { supabase } from "@/components/Supabase/client";
import router from 'next/router';


const UpdateAdminPassword: React.FC = () => {

    const [correctPassword, setCorrectPassword] = useState<string>('');
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);

    useEffect(() => {
        const fetchPassword = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (!session) {
                return;
            }
            // Fetch the password from Supabase and set it as correctPassword
            const { data: setting } = await supabase
                .from('setting')
                .select('password')
                .eq('user_id', session?.user.id)
                .single();
            if (setting) {
                setCorrectPassword(setting.password);
            }
        };
        fetchPassword();
    }, []);

    const verifyAndUpdatePassword = async () => {
        setLoading(true);


        if (!currentPassword) {
            setMessage('エラー: 現在のパスワードは空であってはなりません');
            setLoading(false);
            return;
        }
        else if (!newPassword) {
            setMessage('エラー: 新しいパスワードは空であってはなりません');
            setLoading(false);
            return;
        }
        else if (currentPassword != correctPassword) {
            setMessage('エラー: 現在のパスワードが正しくありません');
            setLoading(false);
            return;
        }
        const {
            data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
            return;
        }
        const updates = {
            user_id: session?.user.id,
            password: newPassword,
        };
        const { data: settingData, error: settingError } = await supabase
            .from('setting')
            .upsert(updates, {
                onConflict: 'user_id',
            });

        if (settingError) {
            setMessage(`Error: ${settingError}`);
        } else {
            setMessage('パスワードが正常に更新されました。');
        }
        setLoading(false);
        router.push('/admin');
    };

    return (
        <div className="flex justify-center items-center h-screen">

            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-5/6 lg:w-1/3">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="current-password">
                        現在のパスワード
                    </label>
                    <input
                        id="current-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="現在のパスワード"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="new-password">
                        新しいパスワード
                    </label>
                    <input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="新しいパスワード"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="inline-flex items-center">
                        <input type="checkbox" className="form-checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                        <span className="ml-2 text-sm text-gray-600">パスワードを表示Show Password</span>
                    </label>
                </div>
                <button
                    onClick={verifyAndUpdatePassword}
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    パスワードを更新
                </button>

                {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
            </div>
        </div>
    );
};

export default UpdateAdminPassword;