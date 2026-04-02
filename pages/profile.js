import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState({ balance_usdt: 0 });

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data } = await supabase.from('wallets').select('*').eq('user_id', user.id).single();
        if (data) setWallet(data);
      }
    };
    getData();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-[#0d0221] text-white" dir="rtl">
      <div className="bg-[#1a0b3c] p-6 rounded-3xl mb-6 border border-purple-500/20 text-center">
        <p className="text-gray-400 text-xs">مرحباً بك</p>
        <h2 className="text-xl font-bold mt-1">{user?.email}</h2>
        <span className="mt-3 inline-block bg-purple-600/20 px-4 py-1 rounded-full text-[10px] text-purple-300">UID: {user?.id.slice(0,8)}</span>
      </div>

      <div className="bg-gradient-to-br from-purple-600 to-indigo-800 p-10 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-purple-100 text-sm opacity-80">الرصيد المتاح</p>
          <h1 className="text-5xl font-black mt-3">${wallet.balance_usdt.toFixed(2)}</h1>
        </div>
      </div>
    </div>
  );
}
