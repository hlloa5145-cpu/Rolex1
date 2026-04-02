import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("خطأ في الدخول: " + error.message);
    } else {
      // التوجه لصفحة الملف الشخصي بعد النجاح
      router.push('/profile');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0d0221] text-white flex flex-col justify-center px-6 py-12 font-sans" dir="rtl">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-block p-4 rounded-3xl bg-gradient-to-tr from-purple-600 to-blue-500 mb-6 shadow-lg shadow-purple-500/20">
            <span className="text-3xl font-black italic tracking-tighter">Ex</span>
        </div>
        <h2 className="text-3xl font-black tracking-tight">مرحباً بك مجدداً</h2>
        <p className="mt-2 text-sm text-gray-400 font-light italic">قم بتسجيل الدخول لمتابعة استثماراتك</p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <form className="space-y-6" onSubmit={handleLogin}>
          {/* البريد الإلكتروني */}
          <div className="group">
            <label className="block text-[10px] font-bold text-purple-400 uppercase tracking-widest mr-2 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1a0b3c] border border-white/5 p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all placeholder-gray-700 font-mono"
              placeholder="example@mail.com"
            />
          </div>

          {/* كلمة المرور */}
          <div className="group">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[10px] font-bold text-purple-400 uppercase tracking-widest mr-2">كلمة المرور</label>
              <button type="button" className="text-[10px] text-gray-500 hover:text-purple-400">نسيت كلمة المرور؟</button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1a0b3c] border border-white/5 p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all placeholder-gray-700"
              placeholder="••••••••"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 p-5 rounded-2xl font-black text-xl shadow-[0_10px_30px_rgba(139,92,246,0.3)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? "جاري الدخول..." : "تسجيل الدخول"}
            </button>
          </div>
        </form>

        <div className="mt-8 flex items-center justify-center space-x-2 space-x-reverse text-sm">
          <span className="text-gray-400">ليس لديك حساب؟</span>
          <Link href="/register" className="font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 hover:opacity-80">
            إنشاء حساب جديد
          </Link>
        </div>
      </div>
      
      {/* Footer بسيط ليعطي طابع التطبيق كما في الصور */}
      <div className="mt-20 text-center">
        <p className="text-[10px] text-gray-600 tracking-tighter uppercase">ExCoreX Security Protocol Enabled 🛡️</p>
      </div>
    </div>
  );
}
