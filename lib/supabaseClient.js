import { createClient } from '@supabase/supabase-js'

// هذه القيم سيتم سحبها من إعدادات Vercel التي سنضبطها لاحقاً للأمان
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("تنبيه: مفاتيح Supabase غير مضبوطة في إعدادات البيئة (Environment Variables)");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
