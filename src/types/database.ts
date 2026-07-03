export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole =
  | "visitor"
  | "member"
  | "volunteer"
  | "president"
  | "vice_president"
  | "board_chair"
  | "admin";

export type AdminRole = "super_admin" | "admin" | "editor" | "moderator";

export type RegistrationStatus = "registered" | "cancelled";

export type EmailStatus = "sent" | "failed";

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
          admin_role: AdminRole | null;
          is_active: boolean;
          username: string | null;
          bio: string | null;
          university: string | null;
          high_school: string | null;
          profession: string | null;
          website_url: string | null;
          linkedin_url: string | null;
          github_url: string | null;
          instagram_url: string | null;
          interests: Json;
          newsletter_opt_in: boolean;
          newsletter_token: string;
          kvkk_consent_at: string | null;
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
          admin_role?: AdminRole | null;
          is_active?: boolean;
          username?: string | null;
          bio?: string | null;
          university?: string | null;
          high_school?: string | null;
          profession?: string | null;
          website_url?: string | null;
          linkedin_url?: string | null;
          github_url?: string | null;
          instagram_url?: string | null;
          interests?: Json;
          newsletter_opt_in?: boolean;
          newsletter_token?: string;
          kvkk_consent_at?: string | null;
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
          admin_role?: AdminRole | null;
          is_active?: boolean;
          username?: string | null;
          bio?: string | null;
          university?: string | null;
          high_school?: string | null;
          profession?: string | null;
          website_url?: string | null;
          linkedin_url?: string | null;
          github_url?: string | null;
          instagram_url?: string | null;
          interests?: Json;
          newsletter_opt_in?: boolean;
          newsletter_token?: string;
          kvkk_consent_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      roles: {
        Row: {
          id: string;
          name: UserRole;
          label: string;
          permissions: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: UserRole;
          label: string;
          permissions?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: UserRole;
          label?: string;
          permissions?: Json;
          created_at?: string;
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
          location: string | null;
          registration_url: string | null;
          image_url: string | null;
          capacity: number | null;
          meeting_url: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description?: string | null;
          event_type: string;
          status?: string;
          event_date?: string | null;
          event_time?: string | null;
          speaker?: string | null;
          location?: string | null;
          registration_url?: string | null;
          image_url?: string | null;
          capacity?: number | null;
          meeting_url?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
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
          location?: string | null;
          registration_url?: string | null;
          image_url?: string | null;
          capacity?: number | null;
          meeting_url?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
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
          image_url: string | null;
          capacity: number | null;
          meeting_url: string | null;
          is_featured: boolean;
          is_published: boolean;
          created_at: string;
          updated_at: string;
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
          image_url?: string | null;
          capacity?: number | null;
          meeting_url?: string | null;
          is_featured?: boolean;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
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
          image_url?: string | null;
          capacity?: number | null;
          meeting_url?: string | null;
          is_featured?: boolean;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      event_registrations: {
        Row: {
          id: string;
          event_id: string | null;
          webinar_id: string | null;
          user_id: string | null;
          full_name: string;
          email: string;
          status: RegistrationStatus;
          attended: boolean | null;
          kvkk_consent_at: string | null;
          cancel_token: string;
          reminder_1d_sent_at: string | null;
          reminder_1h_sent_at: string | null;
          reminder_15m_sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id?: string | null;
          webinar_id?: string | null;
          user_id?: string | null;
          full_name: string;
          email: string;
          status?: RegistrationStatus;
          attended?: boolean | null;
          kvkk_consent_at?: string | null;
          cancel_token?: string;
          reminder_1d_sent_at?: string | null;
          reminder_1h_sent_at?: string | null;
          reminder_15m_sent_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string | null;
          webinar_id?: string | null;
          user_id?: string | null;
          full_name?: string;
          email?: string;
          status?: RegistrationStatus;
          attended?: boolean | null;
          kvkk_consent_at?: string | null;
          cancel_token?: string;
          reminder_1d_sent_at?: string | null;
          reminder_1h_sent_at?: string | null;
          reminder_15m_sent_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      email_log: {
        Row: {
          id: string;
          recipient: string;
          subject: string;
          template: string | null;
          status: EmailStatus;
          error: string | null;
          related_event_id: string | null;
          related_webinar_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          recipient: string;
          subject: string;
          template?: string | null;
          status: EmailStatus;
          error?: string | null;
          related_event_id?: string | null;
          related_webinar_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          recipient?: string;
          subject?: string;
          template?: string | null;
          status?: EmailStatus;
          error?: string | null;
          related_event_id?: string | null;
          related_webinar_id?: string | null;
          created_at?: string;
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
          author_id: string | null;
          read_time: string | null;
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
          author_id?: string | null;
          read_time?: string | null;
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
          author_id?: string | null;
          read_time?: string | null;
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
          metadata: Json;
          kvkk_consent_at: string | null;
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
          metadata?: Json;
          kvkk_consent_at?: string | null;
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
          metadata?: Json;
          kvkk_consent_at?: string | null;
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
          kvkk_consent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          city?: string | null;
          message: string;
          is_read?: boolean;
          kvkk_consent_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          city?: string | null;
          message?: string;
          is_read?: boolean;
          kvkk_consent_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      announcements: {
        Row: {
          id: string;
          title: string;
          content: string;
          link: string | null;
          is_published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          link?: string | null;
          is_published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          link?: string | null;
          is_published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      certificates: {
        Row: {
          id: string;
          registration_id: string;
          code: string;
          full_name: string;
          event_title: string;
          event_date: string | null;
          issued_at: string;
          pdf_path: string | null;
        };
        Insert: {
          id?: string;
          registration_id: string;
          code: string;
          full_name: string;
          event_title: string;
          event_date?: string | null;
          issued_at?: string;
          pdf_path?: string | null;
        };
        Update: {
          id?: string;
          registration_id?: string;
          code?: string;
          full_name?: string;
          event_title?: string;
          event_date?: string | null;
          issued_at?: string;
          pdf_path?: string | null;
        };
        Relationships: [];
      };
      sponsors: {
        Row: {
          id: string;
          name: string;
          tier: string;
          logo_url: string | null;
          website_url: string | null;
          description: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          tier: string;
          logo_url?: string | null;
          website_url?: string | null;
          description?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          tier?: string;
          logo_url?: string | null;
          website_url?: string | null;
          description?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      sponsor_inquiries: {
        Row: {
          id: string;
          company: string;
          contact_name: string;
          email: string;
          message: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          company: string;
          contact_name: string;
          email: string;
          message?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          company?: string;
          contact_name?: string;
          email?: string;
          message?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      audit_log: {
        Row: {
          id: string;
          admin_label: string;
          action: string;
          entity: string;
          entity_id: string | null;
          detail: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_label: string;
          action: string;
          entity: string;
          entity_id?: string | null;
          detail?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          admin_label?: string;
          action?: string;
          entity?: string;
          entity_id?: string | null;
          detail?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      board_members: {
        Row: {
          id: string;
          name: string;
          role: string;
          department: string | null;
          bio: string | null;
          photo_url: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role: string;
          department?: string | null;
          bio?: string | null;
          photo_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string;
          department?: string | null;
          bio?: string | null;
          photo_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      departments: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          highlights: Json;
          icon: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description?: string | null;
          highlights?: Json;
          icon?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string | null;
          highlights?: Json;
          icon?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      revision_requests: {
        Row: {
          id: string;
          user_id: string | null;
          author_name: string;
          title: string;
          description: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          author_name: string;
          title: string;
          description: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          author_name?: string;
          title?: string;
          description?: string;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      revision_comments: {
        Row: {
          id: string;
          request_id: string;
          user_id: string | null;
          author_name: string;
          is_admin: boolean;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          user_id?: string | null;
          author_name: string;
          is_admin?: boolean;
          body: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          request_id?: string;
          user_id?: string | null;
          author_name?: string;
          is_admin?: boolean;
          body?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          assignee: string | null;
          department: string | null;
          status: string;
          due_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          assignee?: string | null;
          department?: string | null;
          status?: string;
          due_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          assignee?: string | null;
          department?: string | null;
          status?: string;
          due_date?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      meetings: {
        Row: {
          id: string;
          title: string;
          meeting_date: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          meeting_date?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          meeting_date?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      events_public: {
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
          location: string | null;
          registration_url: string | null;
          image_url: string | null;
          capacity: number | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Relationships: [];
      };
      webinars_public: {
        Row: {
          id: string;
          event_id: string | null;
          slug: string;
          title: string;
          description: string | null;
          speaker: string | null;
          webinar_date: string | null;
          recording_url: string | null;
          image_url: string | null;
          capacity: number | null;
          is_featured: boolean;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      admin_role: AdminRole;
    };
    CompositeTypes: Record<string, never>;
  };
}
