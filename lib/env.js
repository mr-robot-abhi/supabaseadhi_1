// Environment variables with fallbacks
export const env = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  MONGODB_URI: process.env.MONGODB_URI || "",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
}
