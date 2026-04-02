import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [referralCode, setReferralCode] = useState(''); // اختياري للنظام الذي تريده
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. إنشاء الحساب في نظام التوثيق (Auth)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert("خطأ في التسجيل: " + error.message);
    } else {
      const user = data.user;

      // 2. إدخال بيانات المستخدم في جدول profiles
      // ملاحظة: الـ UID سيتم إنشاؤه تلقائياً إذا كنت قد وضعت SERIAL في SQL
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: user.id, 
            full_name: fullName, 
            email: email,
            kyc_status: 'pending' 
          }
        ]);

      // 3. إنشاء محفظة صفرية للمستخدم الجديد
      await supabase.from('wallets').insert([{ user_id: user.id, balance_usdt: 0 }]);

      if (!profileError) {
        alert("تم إنشاء الحساب بنجاح! يرجى تسجيل الدخول.");
        router.push('/login'); // التوجه لصفحة تسجيل الدخول
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0d0221] text-white flex flex-col justify-center px-6 py-12 font-sans" dir="rtl">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-block p-4 rounded-3xl bg-gradient-to-tr from-purple-600 to-blue-500 mb-4 shadow-lg shadow-purple-500/20">
            <span className="text-3xl font-black italic">Ex</span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight">إنشاء حساب جديد</h2>
        <p className="mt-2 text-sm text-gray-400 font-light">ابدأ رحلة الاستثمار في ExCoreX اليوم</p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <form className="space-y-5" onSubmit={handleRegister}>
          {/* الاسم الكامل */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mr-2 mb-1">الاسم الكامل</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#1a0b3c] border border-white/5 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder-gray-600"
              placeholder="أدخل اسمك الثلاثي"
            />
          </div>

          {/* البريد الإلكتروني */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mr-2 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1a0b3c] border border-white/5 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder-gray-600 font-mono"
              placeholder="example@mail.com"
            />
          </div>

          {/* كلمة المرور */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mr-2 mb-1">كلمة المرور</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1a0b3c] border border-white/5 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder-gray-600"
              placeholder="••••••••"
            />
          </div>

          {/* كود الإحالة (اختياري) */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mr-2 mb-1">كود الدعوة (اختياري)</label>
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="w-full bg-[#1a0b3c] border border-white/5 p-4 rounded-2xl focus:outline-none focus:border-purple-500 transition-all text-center tracking-widest text-purple-400"
              placeholder="Invite Code"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 p-5 rounded-2xl font-black text-lg shadow-xl shadow-purple-900/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب الآن"}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          لديك حساب بالفعل؟{' '}
          <Link href="/login" className="font-bold text-purple-400 hover:text-purple-300">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}
