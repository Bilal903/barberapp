import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wohfoyadzhuzapgjqxfc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvaGZveWFkemh1emFwZ2pxeGZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNjY5NTcsImV4cCI6MjA2NDY0Mjk1N30.9hxs9pkklkn1G8on35_iYxVouMgShZrFcHSgTTrTqe0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);