export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role_id: string | null;
          city: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role_id?: string | null;
          city?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role_id?: string | null;
          city?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          event_type: string;
          status: string;
          event_date: string | null;
          event_time: string | null;
          speaker: string | null;
          is_published: boolean;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description?: string | null;
          event_type: string;
          status: string;
          event_date?: string | null;
          event_time?: string | null;
          speaker?: string | null;
          is_published?: boolean;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string | null;
          event_type?: string;
          status?: string;
          event_date?: string | null;
          event_time?: string | null;
          speaker?: string | null;
          is_published?: boolean;
        };
        Relationships: [];
      };
      webinars: {
        Row: {
          id: string;
          event_id: string | null;
          slug: string;
          title: string;
          description: string | null;
          speaker: string | null;
          webinar_date: string | null;
          recording_url: string | null;
          is_featured: boolean;
          is_published: boolean;
        };
        Insert: {
          id?: string;
          event_id?: string | null;
          slug: string;
          title: string;
          description?: string | null;
          speaker?: string | null;
          webinar_date?: string | null;
          recording_url?: string | null;
          is_featured?: boolean;
          is_published?: boolean;
        };
        Update: {
          id?: string;
          event_id?: string | null;
          slug?: string;
          title?: string;
          description?: string | null;
          speaker?: string | null;
          webinar_date?: string | null;
          recording_url?: string | null;
          is_featured?: boolean;
          is_published?: boolean;
        };
        Relationships: [];
      };
      blogs: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          content: string | null;
          category: string | null;
          tags: Json;
          is_published: boolean;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt?: string | null;
          content?: string | null;
          category?: string | null;
          tags?: Json;
          is_published?: boolean;
          published_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          excerpt?: string | null;
          content?: string | null;
          category?: string | null;
          tags?: Json;
          is_published?: boolean;
          published_at?: string | null;
        };
        Relationships: [];
      };
      applications: {
        Row: {
          id: string;
          type: string;
          full_name: string;
          email: string;
          city: string | null;
          message: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: string;
          full_name: string;
          email: string;
          city?: string | null;
          message?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: string;
          full_name?: string;
          email?: string;
          city?: string | null;
          message?: string | null;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      contacts: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          city: string | null;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          city?: string | null;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          city?: string | null;
          message?: string;
          is_read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
