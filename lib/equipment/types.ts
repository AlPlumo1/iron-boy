import type { Database } from "@/lib/supabase/database.types";

type Tables = Database["public"]["Tables"];

export type Equipment = Tables["equipment"]["Row"];
export type EquipmentInsert = Tables["equipment"]["Insert"];
export type EquipmentUpdate = Tables["equipment"]["Update"];

export type ActivityEquipment = Tables["activity_equipment"]["Row"];

export type ActivityEquipmentInsert = Tables["activity_equipment"]["Insert"];
