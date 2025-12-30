import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== "undefined") {
        console.error("Supabase environment variables are missing. Please check .env.local");
    }
}

// Ensure createClient receives strings, even if empty (it might throw, but we want to avoid strict null checks failing build first if possible, though createClient will validate)
// Better approach: If missing, don't export a broken client that crashes app instantly on import? 
// No, components rely on 'supabase'. Use fallback to prevent build crash, but runtime will fail if used.
export const supabase = createClient(
    supabaseUrl || "https://placeholder.supabase.co",
    supabaseAnonKey || "placeholder-key"
);

export type Wish = {
    id: number;
    message: string;
    created_at: string;
};
