import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function TeamPage() {
  const [stats, setStats] = useState({
    teamCount: 0,
    teamProfit: 0,
    referralCode: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamData();
  }, []);

  async function fetchTeamData() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // 1. حساب عدد أعضاء الفريق (من جدول profiles)
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('referred_by', user.id);

      // 2. جلب أرباح الفريق من المحفظة
      const { data: wallet } = await supabase
        .from('wallets')
        .select('team_profit, id')
        .eq('user_id', user.id)
        .single();

      // 3. جلب الـ UID لاستخدامه ككود دعوة
      const { data: profile } = await supabase
        .from('profiles')
        .select('uid')
        .eq('id', user.id)
        .single();

      setStats({
        teamCount: count || 0,
        teamProfit: wallet?.team_profit || 0,
        referralCode: profile?.uid || ''
      });
    }
    setLoading(false);
  }

  const copyInvite = () => {
    const link = `${window.location.origin}/register?ref=${stats.referralCode}`;
    navigator.clipboard.writeText(link);
    alert("تم نسخ رابط الدعوة بنجاح!");
  };

  if (loading) return <div className="text-white text-center mt-20">جاري تحميل بيانات الفريق...</div>;

  return (
    <div className="min-h-screen bg-[#0d0221] text-white p-6 font-sans" dir="rtl">
      <h1 className="text-2xl font-black mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
        مركز إدارة الفريق
      </h1>

      {/* كروت الإحصائيات - كما في الصورة 7943 */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-[#1a0b3c] p-6 rounded-[2rem] border border-white/5 text-center shadow-xl">
          <p className="text-[10px] text-gray-400 uppercase mb-2">إجمالي الفريق</p>
          <h3 className="text-3xl font-black text-purple-400">{stats.teamCount}</h3>
        </div>
        <div className="bg-[#1a0b3c] p-6 rounded-[2rem] border border-white/5 text-center shadow-xl">
          <p className="text-[10px] text-gray-400 uppercase mb-2">أرباح العمولات</p>
          <h3 className="text-3xl font-black text-green-400">${stats.teamProfit}</h3>
        </div>
      </div>

      {/* قسم رابط الدعوة */}
      <div className="bg-gradient-to-br from-[#2d1461] to-[#120626] p-8 rounded-[2.5rem] border border-white/10 mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-lg font-bold mb-4">ادعُ أصدقاءك واربح 5%</h2>
          <p className="text-xs text-purple-200 mb-6 opacity-70">عندما يقوم أي عضو في فريقك بالإيداع، ستحصل فوراً على عمولة تضاف لرصيدك.</p>
          
          <div className="bg-[#0d0221]/50 p-4 rounded-2xl border border-white/10 flex items-center justify-between">
            <span className="font-mono text-sm tracking-[5px] text-purple-300 font-bold">{stats.referralCode}</span>
            <button 
              onClick={copyInvite}
              className="bg-white text-purple-900 px-4 py-2 rounded-xl text-xs font-black hover:bg-purple-100 transition-all"
            >
              نسخ الرابط
            </button>
          </div>
        </div>
        {/* ديكور خلفية */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* قائمة المستويات (Level 1, Level 2) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-[#1a0b3c] p-5 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">L1</div>
            <span className="font-bold">المستوى الأول</span>
          </div>
          <span className="text-xs text-gray-500 tracking-widest">{stats.teamCount} عضو</span>
        </div>
        <div className="flex items-center justify-between bg-[#1a0b3c] p-5 rounded-2xl border border-white/5 opacity-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center text-pink-400">L2</div>
            <span className="font-bold">المستوى الثاني</span>
          </div>
          <span className="text-xs text-gray-500 tracking-widest">0 عضو</span>
        </div>
      </div>
    </div>
  );
}
