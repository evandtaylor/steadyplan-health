export function getSupabaseRestUrl() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  if (!supabaseUrl) return "";

  const normalizedUrl = supabaseUrl.replace(/\/+$/, "");

  return normalizedUrl.endsWith("/rest/v1")
    ? normalizedUrl
    : `${normalizedUrl}/rest/v1`;
}
