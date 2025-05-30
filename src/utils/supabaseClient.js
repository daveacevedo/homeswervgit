import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zpnpsyiwguqwzldzptyp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwbnBzeWl3Z3Vxd3psZHpwdHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwODM1MDUsImV4cCI6MjA2MjY1OTUwNX0.M10chqsOxOa6F0XgwRIrjcLa1n3AUGKtbFKKXL5VAs8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
