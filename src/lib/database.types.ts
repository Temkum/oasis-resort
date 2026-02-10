export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: 'admin' | 'staff' | 'guest';
        };
        Insert: {
          id?: string;
          user_id: string;
          role: 'admin' | 'staff' | 'guest';
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: 'admin' | 'staff' | 'guest';
        };
      };
      rooms: {
        Row: {
          id: string;
          room_number: string;
          type: string;
          capacity: number;
          price_per_night: number;
          amenities: string[];
          images: string[];
          description: string | null;
          status: 'available' | 'maintenance' | 'booked';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          room_number: string;
          type: string;
          capacity?: number;
          price_per_night: number;
          amenities?: string[];
          images?: string[];
          description?: string | null;
          status?: 'available' | 'maintenance' | 'booked';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          room_number?: string;
          type?: string;
          capacity?: number;
          price_per_night?: number;
          amenities?: string[];
          images?: string[];
          description?: string | null;
          status?: 'available' | 'maintenance' | 'booked';
          created_at?: string;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          room_id: string;
          check_in: string;
          check_out: string;
          guests_count: number;
          total_price: number;
          status:
            | 'pending'
            | 'confirmed'
            | 'checked_in'
            | 'checked_out'
            | 'cancelled';
          extras: string[];
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          room_id: string;
          check_in: string;
          check_out: string;
          guests_count?: number;
          total_price: number;
          status?:
            | 'pending'
            | 'confirmed'
            | 'checked_in'
            | 'checked_out'
            | 'cancelled';
          extras?: string[];
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          room_id?: string;
          check_in?: string;
          check_out?: string;
          guests_count?: number;
          total_price?: number;
          status?:
            | 'pending'
            | 'confirmed'
            | 'checked_in'
            | 'checked_out'
            | 'cancelled';
          extras?: string[];
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      menu_items: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          category: string;
          image_url: string | null;
          available: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price: number;
          category: string;
          image_url?: string | null;
          available?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          category?: string;
          image_url?: string | null;
          available?: boolean;
          created_at?: string;
        };
      };
      table_reservations: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          time: string;
          guests: number;
          table_number: string | null;
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          time: string;
          guests?: number;
          table_number?: string | null;
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          time?: string;
          guests?: number;
          table_number?: string | null;
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          notes?: string | null;
          created_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          date: string;
          price: number;
          capacity: number;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          date: string;
          price?: number;
          capacity?: number;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          date?: string;
          price?: number;
          capacity?: number;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      event_registrations: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string;
          created_at?: string;
        };
      };
      promotions: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          discount_percent: number;
          start_date: string;
          end_date: string;
          applicable_room_types: string[];
          applicable_services: string[];
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          discount_percent?: number;
          start_date: string;
          end_date: string;
          applicable_room_types?: string[];
          applicable_services?: string[];
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          discount_percent?: number;
          start_date?: string;
          end_date?: string;
          applicable_room_types?: string[];
          applicable_services?: string[];
          active?: boolean;
          created_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          category: string;
          available: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price: number;
          category: string;
          available?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          category?: string;
          available?: boolean;
          created_at?: string;
        };
      };
    };
    Functions: {
      has_role: {
        Args: {
          _user_id: string;
          _role: 'admin' | 'staff' | 'guest';
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: 'admin' | 'staff' | 'guest';
      room_status: 'available' | 'maintenance' | 'booked';
      booking_status:
        | 'pending'
        | 'confirmed'
        | 'checked_in'
        | 'checked_out'
        | 'cancelled';
      reservation_status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    };
  };
}
