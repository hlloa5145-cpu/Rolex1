import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function AdminDashboard() {
  const [pendingDeposits, setPendingDeposits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingDeposits();
  }, []);

  // جلب كافة طلبات الإيداع التي تنتظر التأكيد
  async function fetchPendingDeposits() {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        id,
        amount,
        created_at,
        status,
        profiles ( email, uid )
      `)
      .eq('type', 'deposit')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (!error) setPendingDeposits(data);
    setLoading(false);
  }

  // دالة تأكيد الإيداع (هذه ستفعل الـ Trigger الذي كتبناه سابقاً في SQL)
  async function approveDeposit(transactionId) {
    const { error } = await supabase
      .from('transactions')
      .update({ status: 'completed' })
      .eq('id', transactionId);

    if (!error) {
      alert("تم تأكيد الإيداع وإضافة الرصيد للمستخدم بنجاح!");
      fetchPendingDeposits(); // تحديث القائمة
    } else {
      alert("خطأ في التأكيد: " + error.message);
    }
  }

  if (loading) return <div className="text-white text-center mt-20">جاري تحميل بيانات الإدارة...</div>;

  return (
    <div className="min-h-screen bg-[#0d0221] text-white p-8 font-sans" dir="rtl">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
          لوحة تحكم المدير 🔒
        </h1>
        <div className="bg-red-900/20 border border-red-500/50 px-4 py-2 rounded-xl text-red-500 text-xs font-bold">
          وضع المسؤول: متصل
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        📥 طلبات الإيداع الجديدة
        <span className="bg-purple-600 text-[10px] px-2 py-1 rounded-full">{pendingDeposits.length}</span>
      </h2>

      <div className="space-y-4">
        {pendingDeposits.length === 0 && (
          <p className="text-gray-500 text-center py-20 border border-dashed border-white/10 rounded-3xl"> لا توجد طلبات إيداع معلقة حالياً.</p>
        )}

        {pendingDeposits.map((tx) => (
          <div key={tx.id} className="bg-[#1a0b3c] border border-white/5 p-6 rounded-3xl flex items-center justify-between shadow-xl">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-lg font-black text-green-400">${tx.amount}</span>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-400">USDT (TRC20)</span>
              </div>
              <p className="text-sm text-gray-300 font-medium">{tx.profiles?.email}</p>
              <p className="text-[10px] text-gray-500 mt-1">UID: {tx.profiles?.uid} | التاريخ: {new Date(tx.created_at).toLocaleString('ar-EG')}</p>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => approveDeposit(tx.id)}
                className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-green-900/20 transition-all"
              >
                تأكيد العملية ✅
              </button>
              <button className="bg-red-900/30 hover:bg-red-900/50 text-red-500 px-4 py-3 rounded-2xl text-sm font-bold transition-all">
                رفض
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* إحصائيات سريعة للمدير */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-900/20 to-transparent p-6 rounded-3xl border border-blue-500/20">
          <p className="text-xs text-blue-400 mb-2 uppercase font-bold tracking-widest">إجمالي السحوبات</p>
          <h4 className="text-2xl font-black">$0.00</h4>
        </div>
        <div className="bg-gradient-to-br from-purple-900/20 to-transparent p-6 rounded-3xl border border-purple-500/20">
          <p className="text-xs text-purple-400 mb-2 uppercase font-bold tracking-widest">المستخدمين النشطين</p>
          <h4 className="text-2xl font-black">--</h4>
        </div>
      </div>
    </div>
  );
}
