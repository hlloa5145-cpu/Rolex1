import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', name: '', ref: '' });

  useEffect(() => { 
    if (router.query.ref) setForm(prev => ({...prev, ref: router.query.ref}));
  }, [router.query]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password });
    if (error) return alert(error.message);
    if (data.user) {
      await supabase.from('profiles').insert([{ id: data.user.id, full_name: form.name, email: form.email, referrer_id: form.ref }]);
      await supabase.from('wallets').insert([{ user_id: data.user.id, balance_usdt: 0 }]);
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-[#0d0221] text-white flex flex-col justify-center text-right" dir="rtl">
      <h1 className="text-3xl font-bold mb-8 text-center text-purple-500">فتح حساب</h1>
      <form onSubmit={handleSignUp} className="space-y-4">
        <input type="text" placeholder="الاسم" className="w-full p-4 bg-[#1a0b3c] rounded-xl border border-white/10" onChange={e => setForm({...form, name: e.target.value})} required />
        <input type="email" placeholder="البريد الإلكتروني" className="w-full p-4 bg-[#1a0b3c] rounded-xl border border-white/10" onChange={e => setForm({...form, email: e.target.value})} required />
        <input type="password" placeholder="كلمة المرور" className="w-full p-4 bg-[#1a0b3c] rounded-xl border border-white/10" onChange={e => setForm({...form, password: e.target.value})} required />
        <button className="w-full p-4 bg-purple-600 rounded-xl font-bold">تسجيل</button>
      </form>
    </div>
  );
}
