import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function KYCPage() {
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("يرجى اختيار صورة الهوية أولاً");
    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // 1. رفع الصورة إلى Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `kyc-documents/${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('documents') // تأكد من إنشاء Bucket بهذا الاسم في Supabase
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. تحديث بيانات المستخدم في جدول profiles
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          kyc_status: 'pending', // تغيير الحالة إلى قيد المراجعة
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      alert("تم رفع البيانات بنجاح! سيتم مراجعة طلبك من قبل الإدارة.");
      router.push('/profile');
      
    } catch (error) {
      alert("حدث خطأ أثناء الرفع: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0221] text-white p-6 font-sans" dir="rtl">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-black mb-2 text-center">تأكيد الهوية (KYC)</h1>
        <p className="text-xs text-gray-400 text-center mb-8">يرجى تقديم بيانات دقيقة لضمان تفعيل حسابك بالكامل</p>

        <form onSubmit={handleUpload} className="space-y-6">
          {/* الاسم بالكامل */}
          <div>
            <label className="block text-xs font-bold text-purple-400 mb-2 mr-2 uppercase">الاسم الكامل (كما في الهوية)</label>
            <input 
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#1a0b3c] border border-white/5 p-4 rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none"
              placeholder="الاسم الثلاثي"
            />
          </div>

          {/* رقم الهوية */}
          <div>
            <label className="block text-xs font-bold text-purple-400 mb-2 mr-2 uppercase">رقم الهوية / جواز السفر</label>
            <input 
              type="text"
              required
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              className="w-full bg-[#1a0b3c] border border-white/5 p-4 rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none"
              placeholder="رقم الوثيقة الرسمية"
            />
          </div>

          {/* رفع الصورة */}
          <div className="relative group">
            <label className="block text-xs font-bold text-purple-400 mb-2 mr-2 uppercase">صورة الوثيقة الرسمية</label>
            <div className="w-full bg-[#1a0b3c] border-2 border-dashed border-purple-500/30 rounded-3xl p-8 text-center hover:border-purple-500 transition-all cursor-pointer">
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-2">
                <span className="text-3xl">📷</span>
                <p className="text-xs text-gray-400">{file ? `تم اختيار: ${file.name}` : "اضغط لرفع صورة الهوية أو جواز السفر"}</p>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={uploading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 p-5 rounded-2xl font-black text-lg shadow-xl disabled:opacity-50 transition-all"
          >
            {uploading ? "جاري المعالجة..." : "إرسال البيانات للمراجعة"}
          </button>
        </form>

        <div className="mt-8 p-4 bg-blue-900/10 border border-blue-500/20 rounded-2xl">
          <p className="text-[10px] text-blue-400 leading-relaxed">
            * يتم تشفير بياناتك الشخصية وحفظها بشكل آمن. تستغرق عملية المراجعة عادةً من 12 إلى 24 ساعة.
          </p>
        </div>
      </div>
    </div>
  );
}
