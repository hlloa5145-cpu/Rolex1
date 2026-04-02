import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert("خطأ: " + error.message);
    if (data.user) router.push('/profile');
  };

  return (
    <div className="min-h-screen p-6 bg-[#0d0221] text-white flex flex-col justify-center text-right" dir="rtl">
      <h1 className="text-3xl font-bold mb-8 text-center text-purple-500">تسجيل الدخول</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="email" placeholder="البريد" className="w-full p-4 bg-[#1a0b3c] rounded-xl border border-white/10" onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="كلمة المرور" className="w-full p-4 bg-[#1a0b3c] rounded-xl border border-white/10" onChange={e => setPassword(e.target.value)} required />
        <button className="w-full p-4 bg-indigo-600 rounded-xl font-bold">دخول</button>
      </form>
    </div>
  );
}
