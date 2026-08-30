import type { Database } from "@/lib/supabase/database.types";

type Tables = Database["public"]["Tables"];

export type Activity = Tables["activities"]["Row"];
export type ActivityInsert = Tables["activities"]["Insert"];
export type ActivityUpdate = Tables["activities"]["Update"];
export type ActivitySport = Database["public"]["Enums"]["activity_sport"];
export type ActivityFeeling = Database["public"]["Enums"]["activity_feeling"];
export type ActivityWeather = Database["public"]["Enums"]["weather"];

export type ActivityEnvironment = Tables["activity_environment"]["Row"];
export type ActivityEnvironmentInsert =
  Tables["activity_environment"]["Insert"];

export type RunningActivity = Tables["running_activities"]["Row"];
export type RunningActivityInsert = Tables["running_activities"]["Insert"];

export type CyclingActivity = Tables["cycling_activities"]["Row"];
export type CyclingActivityInsert = Tables["cycling_activities"]["Insert"];

export type SwimmingActivity = Tables["swimming_activities"]["Row"];
export type SwimmingActivityInsert = Tables["swimming_activities"]["Insert"];
