"use client";

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASEURL || "";
const supabaseKey: string = process.env.NEXT_PUBLIC_SUPABASEKEY || "";

// export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
export const supabase: SupabaseClient = createClient(
    supabaseUrl,
    supabaseKey,
);



// const supabase = createClient(supabaseUrl, supabaseKey, {
//     auth: {
//       autoRefreshToken: false, // All my Supabase access is from server, so no need to refresh the token
//       detectSessionInUrl: false, // We are not using OAuth, so we don't need this. Also, we are manually "detecting" the session in the server-side code
//       persistSession: false, // All our access is from server, so no need to persist the session to browser's local storage
//     },
