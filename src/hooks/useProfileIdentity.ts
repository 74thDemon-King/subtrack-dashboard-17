import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
const fallback = { name: "SubTrack User", email: "" };

export function useProfileIdentity() {
  const [profile, setProfile] = useState(fallback);
  useEffect(() => { let active = true; void supabase.auth.getUser().then(async ({ data }) => { if (!data.user || !active) return; const { data: record } = await supabase.from("profiles").select("display_name").eq("id", data.user.id).maybeSingle(); if (active) setProfile({ name: record?.display_name || data.user.user_metadata?.display_name || data.user.email?.split("@")[0] || fallback.name, email: data.user.email ?? "" }); }); return () => { active = false; }; }, []);
  return profile;
}