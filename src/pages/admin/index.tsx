import React, { useEffect, useState } from 'react';
import Admin from '@/components/Admin/Admin';
import { supabase } from '@/components/Supabase/client';


export default function ProtectedPage() {
  const [inputPassword, setInputPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [correctPassword, setCorrectPassword] = useState<string>('');

  useEffect(() => {

    const fetchPassword = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        return;
    }
      // Fetch the password from Supabase and set it as correctPassword
      // This is just a pseudocode example, replace this with actual Supabase fetching logic


      console.log(session?.user.id)
      const { data: setting } = await supabase
        .from('setting')
        .select()
        .eq('user_id', session?.user.id)
        .single();

        console.log(setting)
      console.log(session?. user.id)
      
      if (setting) {
        console.log(setting?.password)
        setCorrectPassword(setting.password);
      }
      else{
        console.log("sfsds")
      }
    };
    fetchPassword();
  }, []);

  const handlePasswordSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    console.log("inputPassword", inputPassword);
    console.log("correctPassword", correctPassword);
    if (inputPassword === correctPassword) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      alert('パスワードが間違っています!');
      setInputPassword('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className=' w-96 mx-auto mt-10'>
        <form onSubmit={handlePasswordSubmit}>
          <div className="mb-6">
            <label className="block mb-2 text-[20px] font-medium text-gray-900 ml-5">パスワード</label>
            <input type="password" id="password"
              className="bg-gray-50  text-gray-500 text-sm rounded-lg block w-full p-2.5"
              placeholder="•••••••••" required
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
            />
          </div>
          <button className="flex justify-center w-[100px] bg-transparent hover:bg-blue-500 text-blue-700 text-[20px] font-semibold hover:text-white py-2 px-4 border border-blue-500 
            hover:border-transparent rounded">
            確 認
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <Admin />
    </div>
  );
}
