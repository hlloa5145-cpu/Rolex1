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
    <div className="min-h-screen p-6 bg-[#0d0221] text-white text-right" dir="rtl">
      <div className="bg-[#1a0b3c] p-6 rounded-2xl border border-purple-500/20 mb-6 shadow-lg">
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">المستخدم</p>
        <h2 className="text-xl font-black mt-2 text-purple-400">{user?.email}</h2>
      </div>

      <div className="bg-gradient-to-br from-purple-700 to-indigo-900 p-10 rounded-3xl text-center shadow-2xl">
        <p className="text-purple-200 text-sm opacity-80 mb-2">إجمالي الرصيد</p>
        <h1 className="text-5xl font-black">${wallet.balance_usdt.toFixed(2)}</h1>
      </div>
    </div>
  );
}
