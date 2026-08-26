import { createClient } from "@/lib/supabase/server";

export async function getActivities() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .order("started_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getActivityById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
