export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          avg_heart_rate_bpm: number | null;
          calories: number | null;
          comment: string | null;
          created_at: string;
          distance_meters: number | null;
          duration_seconds: number;
          external_id: string | null;
          feeling: Database["public"]["Enums"]["activity_feeling"] | null;
          id: string;
          max_heart_rate_bpm: number | null;
          source: Database["public"]["Enums"]["activity_source"];
          sport: Database["public"]["Enums"]["activity_sport"];
          started_at: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          avg_heart_rate_bpm?: number | null;
          calories?: number | null;
          comment?: string | null;
          created_at?: string;
          distance_meters?: number | null;
          duration_seconds: number;
          external_id?: string | null;
          feeling?: Database["public"]["Enums"]["activity_feeling"] | null;
          id?: string;
          max_heart_rate_bpm?: number | null;
          source?: Database["public"]["Enums"]["activity_source"];
          sport: Database["public"]["Enums"]["activity_sport"];
          started_at: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          avg_heart_rate_bpm?: number | null;
          calories?: number | null;
          comment?: string | null;
          created_at?: string;
          distance_meters?: number | null;
          duration_seconds?: number;
          external_id?: string | null;
          feeling?: Database["public"]["Enums"]["activity_feeling"] | null;
          id?: string;
          max_heart_rate_bpm?: number | null;
          source?: Database["public"]["Enums"]["activity_source"];
          sport?: Database["public"]["Enums"]["activity_sport"];
          started_at?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "activities_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      activity_environment: {
        Row: {
          activity_id: string;
          elevation_gain_m: number | null;
          elevation_loss_m: number | null;
          max_altitude_m: number | null;
          min_altitude_m: number | null;
          temperature_c: number | null;
          weather: Database["public"]["Enums"]["weather"] | null;
          wind_direction: Database["public"]["Enums"]["wind_direction"] | null;
          wind_speed_kmh: number | null;
        };
        Insert: {
          activity_id: string;
          elevation_gain_m?: number | null;
          elevation_loss_m?: number | null;
          max_altitude_m?: number | null;
          min_altitude_m?: number | null;
          temperature_c?: number | null;
          weather?: Database["public"]["Enums"]["weather"] | null;
          wind_direction?: Database["public"]["Enums"]["wind_direction"] | null;
          wind_speed_kmh?: number | null;
        };
        Update: {
          activity_id?: string;
          elevation_gain_m?: number | null;
          elevation_loss_m?: number | null;
          max_altitude_m?: number | null;
          min_altitude_m?: number | null;
          temperature_c?: number | null;
          weather?: Database["public"]["Enums"]["weather"] | null;
          wind_direction?: Database["public"]["Enums"]["wind_direction"] | null;
          wind_speed_kmh?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "activity_environment_activity_id_fkey";
            columns: ["activity_id"];
            isOneToOne: true;
            referencedRelation: "activities";
            referencedColumns: ["id"];
          },
        ];
      };
      activity_equipment: {
        Row: {
          activity_id: string;
          equipment_id: string;
        };
        Insert: {
          activity_id: string;
          equipment_id: string;
        };
        Update: {
          activity_id?: string;
          equipment_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "activity_equipment_activity_id_fkey";
            columns: ["activity_id"];
            isOneToOne: false;
            referencedRelation: "activities";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "activity_equipment_equipment_id_fkey";
            columns: ["equipment_id"];
            isOneToOne: false;
            referencedRelation: "equipment";
            referencedColumns: ["id"];
          },
        ];
      };
      cycling_activities: {
        Row: {
          activity_id: string;
          avg_cadence_rpm: number | null;
          avg_power_w: number | null;
          max_cadence_rpm: number | null;
          max_power_w: number | null;
        };
        Insert: {
          activity_id: string;
          avg_cadence_rpm?: number | null;
          avg_power_w?: number | null;
          max_cadence_rpm?: number | null;
          max_power_w?: number | null;
        };
        Update: {
          activity_id?: string;
          avg_cadence_rpm?: number | null;
          avg_power_w?: number | null;
          max_cadence_rpm?: number | null;
          max_power_w?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "cycling_activities_activity_id_fkey";
            columns: ["activity_id"];
            isOneToOne: true;
            referencedRelation: "activities";
            referencedColumns: ["id"];
          },
        ];
      };
      equipment: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          purchased_at: string | null;
          retired_at: string | null;
          type: Database["public"]["Enums"]["equipment_type"];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          purchased_at?: string | null;
          retired_at?: string | null;
          type: Database["public"]["Enums"]["equipment_type"];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          purchased_at?: string | null;
          retired_at?: string | null;
          type?: Database["public"]["Enums"]["equipment_type"];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "equipment_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          display_name: string | null;
          id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          display_name?: string | null;
          id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          display_name?: string | null;
          id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      running_activities: {
        Row: {
          activity_id: string;
          avg_cadence_spm: number | null;
          max_cadence_spm: number | null;
        };
        Insert: {
          activity_id: string;
          avg_cadence_spm?: number | null;
          max_cadence_spm?: number | null;
        };
        Update: {
          activity_id?: string;
          avg_cadence_spm?: number | null;
          max_cadence_spm?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "running_activities_activity_id_fkey";
            columns: ["activity_id"];
            isOneToOne: true;
            referencedRelation: "activities";
            referencedColumns: ["id"];
          },
        ];
      };
      swimming_activities: {
        Row: {
          activity_id: string;
          environment: Database["public"]["Enums"]["swimming_environment"];
          pool_length_m: number | null;
        };
        Insert: {
          activity_id: string;
          environment: Database["public"]["Enums"]["swimming_environment"];
          pool_length_m?: number | null;
        };
        Update: {
          activity_id?: string;
          environment?: Database["public"]["Enums"]["swimming_environment"];
          pool_length_m?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "swimming_activities_activity_id_fkey";
            columns: ["activity_id"];
            isOneToOne: true;
            referencedRelation: "activities";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      activity_feeling:
        "very_easy" | "easy" | "moderate" | "hard" | "very_hard";
      activity_source: "manual" | "garmin" | "import";
      activity_sport: "running" | "cycling" | "swimming";
      equipment_type: "running_shoes" | "bike" | "swim_equipment" | "other";
      swimming_environment: "pool" | "open_water";
      weather:
        | "sunny"
        | "partly_sunny"
        | "rainy"
        | "foggy"
        | "snowy"
        | "stormy"
        | "overcast";
      wind_direction: "n" | "ne" | "e" | "se" | "s" | "so" | "o" | "no";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      activity_feeling: ["very_easy", "easy", "moderate", "hard", "very_hard"],
      activity_source: ["manual", "garmin", "import"],
      activity_sport: ["running", "cycling", "swimming"],
      equipment_type: ["running_shoes", "bike", "swim_equipment", "other"],
      swimming_environment: ["pool", "open_water"],
      weather: [
        "sunny",
        "partly_sunny",
        "rainy",
        "foggy",
        "snowy",
        "stormy",
        "overcast",
      ],
      wind_direction: ["n", "ne", "e", "se", "s", "so", "o", "no"],
    },
  },
} as const;
