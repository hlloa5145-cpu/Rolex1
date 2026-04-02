import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function AdminDashboard() {
  const [pendingDeposits, setPendingDeposits] = useState([]);

  useEffect(() => {
    fetchDeposits();
  }, []);

  async function fetchDeposits() {
    const { data } = await supabase.from('transactions').select('*, profiles(email)').eq('status', 'pending');
    if (data) setPendingDeposits(data);
  }

  async function approve(id) {
    const { error } = await supabase.from('transactions').update({ status: 'completed' }).eq('id', id);
    if (!error) { alert("تم التأكيد!"); fetchDeposits(); }
  }

  return (
    <div className="min-h-screen p-8 bg-[#0d0221] text-white" dir="rtl">
      <h1 className="text-2xl font-black mb-8 border-r-4 border-yellow-500 pr-4">لوحة تحكم المدير 👑</h1>
      <div className="space-y-4">
        {pendingDeposits.map(tx => (
          <div key={tx.id} className="bg-[#1a0b3c] p-6 rounded-2xl flex justify-between items-center border border-white/5">
            <div>
              <p className="text-green-400 font-bold text-xl">${tx.amount}</p>
              <p className="text-xs text-gray-400">{tx.profiles?.email}</p>
            </div>
            <button onClick={() => approve(tx.id)} className="bg-green-600 px-6 py-2 rounded-xl text-sm font-bold">تأكيد الإيداع ✅</button>
          </div>
        ))}
      </div>
    </div>
  );
}
