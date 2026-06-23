import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pbxbgfqpiwxeeloteebs.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_yM3xwSEGZtsyTnNBMWWWIQ_tW0j0h8x';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
