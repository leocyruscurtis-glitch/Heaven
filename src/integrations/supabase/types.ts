export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_event_proposals: {
        Row: {
          created_at: string
          detected_interest_count: number | null
          detected_theme: string
          id: string
          organiser_id: string | null
          proposal_reason: string | null
          status: string
          suggested_end_time: string | null
          suggested_lat: number | null
          suggested_lng: number | null
          suggested_location_name: string | null
          suggested_start_time: string | null
          weather_note: string | null
          zone_id: string | null
        }
        Insert: {
          created_at?: string
          detected_interest_count?: number | null
          detected_theme: string
          id?: string
          organiser_id?: string | null
          proposal_reason?: string | null
          status?: string
          suggested_end_time?: string | null
          suggested_lat?: number | null
          suggested_lng?: number | null
          suggested_location_name?: string | null
          suggested_start_time?: string | null
          weather_note?: string | null
          zone_id?: string | null
        }
        Update: {
          created_at?: string
          detected_interest_count?: number | null
          detected_theme?: string
          id?: string
          organiser_id?: string | null
          proposal_reason?: string | null
          status?: string
          suggested_end_time?: string | null
          suggested_lat?: number | null
          suggested_lng?: number | null
          suggested_location_name?: string | null
          suggested_start_time?: string | null
          weather_note?: string | null
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_event_proposals_organiser_id_fkey"
            columns: ["organiser_id"]
            isOneToOne: false
            referencedRelation: "organisers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_event_proposals_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "location_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      check_ins: {
        Row: {
          checked_in_at: string
          event_id: string
          id: string
          method: string
          user_id: string
        }
        Insert: {
          checked_in_at?: string
          event_id: string
          id?: string
          method?: string
          user_id: string
        }
        Update: {
          checked_in_at?: string
          event_id?: string
          id?: string
          method?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "check_ins_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "check_ins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      event_participants: {
        Row: {
          created_at: string
          event_id: string
          id: string
          invitation_status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          invitation_status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          invitation_status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_suggestions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          bring_friend: boolean
          checked_in: boolean
          created_at: string
          event_id: string
          id: string
          linked_friend_group_id: string | null
          participation_state: Database["public"]["Enums"]["participation_state"]
          updated_at: string
          user_id: string
        }
        Insert: {
          bring_friend?: boolean
          checked_in?: boolean
          created_at?: string
          event_id: string
          id?: string
          linked_friend_group_id?: string | null
          participation_state: Database["public"]["Enums"]["participation_state"]
          updated_at?: string
          user_id: string
        }
        Update: {
          bring_friend?: boolean
          checked_in?: boolean
          created_at?: string
          event_id?: string
          id?: string
          linked_friend_group_id?: string | null
          participation_state?: Database["public"]["Enums"]["participation_state"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_registrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      event_suggestions: {
        Row: {
          city: string
          created_at: string
          created_by_ai: boolean
          description: string | null
          id: string
          invitation_text: string | null
          match_reason: string | null
          max_participants: number
          shared_interest: string
          status: string
          suggested_date: string | null
          title: string
        }
        Insert: {
          city: string
          created_at?: string
          created_by_ai?: boolean
          description?: string | null
          id?: string
          invitation_text?: string | null
          match_reason?: string | null
          max_participants?: number
          shared_interest: string
          status?: string
          suggested_date?: string | null
          title: string
        }
        Update: {
          city?: string
          created_at?: string
          created_by_ai?: boolean
          description?: string | null
          id?: string
          invitation_text?: string | null
          match_reason?: string | null
          max_participants?: number
          shared_interest?: string
          status?: string
          suggested_date?: string | null
          title?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          accessibility_info: string | null
          address: string | null
          age_range_max: number
          age_range_min: number
          beginner_friendly: boolean
          bring_friend_allowed: boolean
          category: string
          created_at: string
          current_registration: number
          description: string | null
          distance_km: number
          end_time: string | null
          equipment_needed: Json
          gender_requirement_optional: string | null
          gender_requirement_reason: string | null
          icon: string | null
          id: string
          is_live: boolean
          lat: number
          lng: number
          location_name: string | null
          max_capacity: number
          min_capacity: number
          organiser_id: string
          organiser_name: string
          organiser_verified: boolean
          people_usually_come_alone: boolean
          recommendation_reason: string | null
          skill_level: string
          spectators_allowed: boolean
          start_in_min: number
          start_time: string | null
          status: Database["public"]["Enums"]["event_status"]
          subcategory: string | null
          team_based: boolean
          team_size: number | null
          title: string
          updated_at: string
          verified_organiser_required: boolean
          welcome_host_description: string | null
          welcome_host_present: boolean
          zone_id: string | null
        }
        Insert: {
          accessibility_info?: string | null
          address?: string | null
          age_range_max?: number
          age_range_min?: number
          beginner_friendly?: boolean
          bring_friend_allowed?: boolean
          category: string
          created_at?: string
          current_registration?: number
          description?: string | null
          distance_km?: number
          end_time?: string | null
          equipment_needed?: Json
          gender_requirement_optional?: string | null
          gender_requirement_reason?: string | null
          icon?: string | null
          id?: string
          is_live?: boolean
          lat: number
          lng: number
          location_name?: string | null
          max_capacity?: number
          min_capacity?: number
          organiser_id: string
          organiser_name: string
          organiser_verified?: boolean
          people_usually_come_alone?: boolean
          recommendation_reason?: string | null
          skill_level?: string
          spectators_allowed?: boolean
          start_in_min?: number
          start_time?: string | null
          status?: Database["public"]["Enums"]["event_status"]
          subcategory?: string | null
          team_based?: boolean
          team_size?: number | null
          title: string
          updated_at?: string
          verified_organiser_required?: boolean
          welcome_host_description?: string | null
          welcome_host_present?: boolean
          zone_id?: string | null
        }
        Update: {
          accessibility_info?: string | null
          address?: string | null
          age_range_max?: number
          age_range_min?: number
          beginner_friendly?: boolean
          bring_friend_allowed?: boolean
          category?: string
          created_at?: string
          current_registration?: number
          description?: string | null
          distance_km?: number
          end_time?: string | null
          equipment_needed?: Json
          gender_requirement_optional?: string | null
          gender_requirement_reason?: string | null
          icon?: string | null
          id?: string
          is_live?: boolean
          lat?: number
          lng?: number
          location_name?: string | null
          max_capacity?: number
          min_capacity?: number
          organiser_id?: string
          organiser_name?: string
          organiser_verified?: boolean
          people_usually_come_alone?: boolean
          recommendation_reason?: string | null
          skill_level?: string
          spectators_allowed?: boolean
          start_in_min?: number
          start_time?: string | null
          status?: Database["public"]["Enums"]["event_status"]
          subcategory?: string | null
          team_based?: boolean
          team_size?: number | null
          title?: string
          updated_at?: string
          verified_organiser_required?: boolean
          welcome_host_description?: string | null
          welcome_host_present?: boolean
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_organiser_id_fkey"
            columns: ["organiser_id"]
            isOneToOne: false
            referencedRelation: "organisers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "location_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      interests: {
        Row: {
          category: string | null
          created_at: string
          icon: string | null
          id: string
          name: string
          parent_interest_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          icon?: string | null
          id: string
          name: string
          parent_interest_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          parent_interest_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interests_parent_interest_id_fkey"
            columns: ["parent_interest_id"]
            isOneToOne: false
            referencedRelation: "interests"
            referencedColumns: ["id"]
          },
        ]
      }
      location_zones: {
        Row: {
          boundary_coordinates: Json | null
          center_lat: number
          center_lng: number
          created_at: string
          default_radius_km: number
          id: string
          municipality: string
          name: string
        }
        Insert: {
          boundary_coordinates?: Json | null
          center_lat: number
          center_lng: number
          created_at?: string
          default_radius_km?: number
          id: string
          municipality: string
          name: string
        }
        Update: {
          boundary_coordinates?: Json | null
          center_lat?: number
          center_lng?: number
          created_at?: string
          default_radius_km?: number
          id?: string
          municipality?: string
          name?: string
        }
        Relationships: []
      }
      municipality_admins: {
        Row: {
          auth_user_id: string
          created_at: string
          id: string
          municipality: string
          name: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          auth_user_id: string
          created_at?: string
          id?: string
          municipality?: string
          name?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          auth_user_id?: string
          created_at?: string
          id?: string
          municipality?: string
          name?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      municipality_metrics: {
        Row: {
          anonymized_belonging_score: number | null
          attendance_count: number
          created_at: string
          date: string
          demand_capacity_gap: number | null
          event_volume: number
          first_time_participant_count: number
          hobby_demand_index: Json | null
          id: string
          retention_rate: number
          zone_id: string | null
        }
        Insert: {
          anonymized_belonging_score?: number | null
          attendance_count?: number
          created_at?: string
          date?: string
          demand_capacity_gap?: number | null
          event_volume?: number
          first_time_participant_count?: number
          hobby_demand_index?: Json | null
          id?: string
          retention_rate?: number
          zone_id?: string | null
        }
        Update: {
          anonymized_belonging_score?: number | null
          attendance_count?: number
          created_at?: string
          date?: string
          demand_capacity_gap?: number | null
          event_volume?: number
          first_time_participant_count?: number
          hobby_demand_index?: Json | null
          id?: string
          retention_rate?: number
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "municipality_metrics_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "location_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          distance_km: number | null
          event_categories: Json | null
          frequency: string | null
          large_event_invites: boolean | null
          paused: boolean | null
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          small_group_invites: boolean | null
          user_id: string
        }
        Insert: {
          distance_km?: number | null
          event_categories?: Json | null
          frequency?: string | null
          large_event_invites?: boolean | null
          paused?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          small_group_invites?: boolean | null
          user_id: string
        }
        Update: {
          distance_km?: number | null
          event_categories?: Json | null
          frequency?: string | null
          large_event_invites?: boolean | null
          paused?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          small_group_invites?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organiser_verification_steps: {
        Row: {
          btw_status: boolean
          created_at: string
          email_verified: boolean
          iban_status: boolean
          id: string
          id_verified: boolean
          kvk_status: boolean
          municipality_token_status: boolean
          organiser_id: string
          overall_status: Database["public"]["Enums"]["verification_status"]
          phone_verified: boolean
          ubo_status: boolean
          updated_at: string
          vog_status: boolean
        }
        Insert: {
          btw_status?: boolean
          created_at?: string
          email_verified?: boolean
          iban_status?: boolean
          id?: string
          id_verified?: boolean
          kvk_status?: boolean
          municipality_token_status?: boolean
          organiser_id: string
          overall_status?: Database["public"]["Enums"]["verification_status"]
          phone_verified?: boolean
          ubo_status?: boolean
          updated_at?: string
          vog_status?: boolean
        }
        Update: {
          btw_status?: boolean
          created_at?: string
          email_verified?: boolean
          iban_status?: boolean
          id?: string
          id_verified?: boolean
          kvk_status?: boolean
          municipality_token_status?: boolean
          organiser_id?: string
          overall_status?: Database["public"]["Enums"]["verification_status"]
          phone_verified?: boolean
          ubo_status?: boolean
          updated_at?: string
          vog_status?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "organiser_verification_steps_organiser_id_fkey"
            columns: ["organiser_id"]
            isOneToOne: true
            referencedRelation: "organisers"
            referencedColumns: ["id"]
          },
        ]
      }
      organisers: {
        Row: {
          auth_user_id: string | null
          created_at: string
          email: string | null
          id: string
          municipality_zone_id: string | null
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          type: Database["public"]["Enums"]["organiser_type"]
          updated_at: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          municipality_zone_id?: string | null
          name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          type?: Database["public"]["Enums"]["organiser_type"]
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          municipality_zone_id?: string | null
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          type?: Database["public"]["Enums"]["organiser_type"]
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "organisers_municipality_zone_id_fkey"
            columns: ["municipality_zone_id"]
            isOneToOne: false
            referencedRelation: "location_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      recommendations: {
        Row: {
          created_at: string
          event_id: string
          id: string
          inputs_used: Json | null
          recommendation_reason: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          inputs_used?: Json | null
          recommendation_reason?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          inputs_used?: Json | null
          recommendation_reason?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      team_assignments: {
        Row: {
          created_at: string
          event_id: string
          id: string
          linked_friend_group_id: string | null
          team_label: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          linked_friend_group_id?: string | null
          team_label: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          linked_friend_group_id?: string | null
          team_label?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_assignments_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_interests: {
        Row: {
          created_at: string
          id: string
          intensity: number | null
          interest_category: string | null
          interest_id: string | null
          interest_name: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          intensity?: number | null
          interest_category?: string | null
          interest_id?: string | null
          interest_name?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          intensity?: number | null
          interest_category?: string | null
          interest_id?: string | null
          interest_name?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_interests_interest_id_fkey"
            columns: ["interest_id"]
            isOneToOne: false
            referencedRelation: "interests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_interests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          accessibility_preferences: Json
          age: number | null
          age_range: string | null
          auth_user_id: string
          city: string | null
          created_at: string
          full_name: string | null
          gender_optional: string | null
          id: string
          location_zone_id: string | null
          notification_preferences: Json
          onboarding_complete: boolean
          privacy_settings: Json
          radius_km: number
          role: Database["public"]["Enums"]["app_role"]
          selected_interests: Json
          short_bio: string | null
          updated_at: string
        }
        Insert: {
          accessibility_preferences?: Json
          age?: number | null
          age_range?: string | null
          auth_user_id: string
          city?: string | null
          created_at?: string
          full_name?: string | null
          gender_optional?: string | null
          id?: string
          location_zone_id?: string | null
          notification_preferences?: Json
          onboarding_complete?: boolean
          privacy_settings?: Json
          radius_km?: number
          role?: Database["public"]["Enums"]["app_role"]
          selected_interests?: Json
          short_bio?: string | null
          updated_at?: string
        }
        Update: {
          accessibility_preferences?: Json
          age?: number | null
          age_range?: string | null
          auth_user_id?: string
          city?: string | null
          created_at?: string
          full_name?: string | null
          gender_optional?: string | null
          id?: string
          location_zone_id?: string | null
          notification_preferences?: Json
          onboarding_complete?: boolean
          privacy_settings?: Json
          radius_km?: number
          role?: Database["public"]["Enums"]["app_role"]
          selected_interests?: Json
          short_bio?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_location_zone_id_fkey"
            columns: ["location_zone_id"]
            isOneToOne: false
            referencedRelation: "location_zones"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_organiser_id: { Args: never; Returns: string }
      current_user_id: { Args: never; Returns: string }
      has_role: {
        Args: { _role: Database["public"]["Enums"]["app_role"]; _uid: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "resident" | "organiser" | "municipality_admin"
      event_status:
        | "open"
        | "live"
        | "scheduled"
        | "minimum_reached"
        | "almost_full"
        | "full"
        | "at_risk_of_cancellation"
        | "cancelled_low_registration"
        | "completed"
      organiser_type:
        | "municipality_department"
        | "sports_club"
        | "library"
        | "school"
        | "university"
        | "community_center"
        | "ngo"
        | "neighbourhood_volunteer"
      participation_state:
        | "Interested"
        | "Maybe"
        | "Join"
        | "Remind me later"
        | "Bring a friend"
        | "Spectator"
      verification_status:
        | "not_started"
        | "in_progress"
        | "awaiting_review"
        | "verified"
        | "rejected"
        | "needs_correction"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["resident", "organiser", "municipality_admin"],
      event_status: [
        "open",
        "live",
        "scheduled",
        "minimum_reached",
        "almost_full",
        "full",
        "at_risk_of_cancellation",
        "cancelled_low_registration",
        "completed",
      ],
      organiser_type: [
        "municipality_department",
        "sports_club",
        "library",
        "school",
        "university",
        "community_center",
        "ngo",
        "neighbourhood_volunteer",
      ],
      participation_state: [
        "Interested",
        "Maybe",
        "Join",
        "Remind me later",
        "Bring a friend",
        "Spectator",
      ],
      verification_status: [
        "not_started",
        "in_progress",
        "awaiting_review",
        "verified",
        "rejected",
        "needs_correction",
      ],
    },
  },
} as const
