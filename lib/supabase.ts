import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const supabase = createClient(
  'https://acfmqteiomnstxmkmpnz.supabase.co',  // replace with your Supabase URL
  'sb_publishable_sFbN-Cb-UHY1FNB4iAa1bg_O7U4nxx6',                     // replace with your anon key
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);