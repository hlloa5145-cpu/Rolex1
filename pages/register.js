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
      alert("تم التسجيل بنجاح!");
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-[#0d0221] text-white flex flex-col justify-center" dir="rtl">
      <h1 className="text-3xl font-black mb-10 text-center text-accent">إنشاء حساب جديد</h1>
      <form onSubmit={handleSignUp} className="space-y-4">
        <input type="text" placeholder="الاسم الكامل" className="w-full p-4 bg-[#1a0b3c] rounded-2xl border border-white/5" onChange={e => setForm({...form, name: e.target.value})} required />
        <input type="email" placeholder="البريد الإلكتروني" className="w-full p-4 bg-[#1a0b3c] rounded-2xl border border-white/5" onChange={e => setForm({...form, email: e.target.value})} required />
        <input type="password" placeholder="كلمة المرور" className="w-full p-4 bg-[#1a0b3c] rounded-2xl border border-white/5" onChange={e => setForm({...form, password: e.target.value})} required />
        <input type="text" value={form.ref} placeholder="كود الدعوة (اختياري)" className="w-full p-4 bg-[#1a0b3c]/50 rounded-2xl border border-white/5 text-purple-400" readOnly />
        <button className="w-full p-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-black text-lg shadow-xl shadow-purple-900/20">ابدأ الآن 🚀</button>
      </form>
    </div>
  );
}
