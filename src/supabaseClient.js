import { createClient } from '@supabase/supabase-js'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseUrl = import.meta.env.https://urnkeiigxdrovpwukrew.supabase.co/rest/v1/
const supabaseAnonKey = import.meta.env.sb_publishable_266wZanOHASHo_CVofa_PA_KSgLKh_D
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
