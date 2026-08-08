export type UserRole = 'owner' | 'admin' | 'guru' | 'finance';
export type StudentGender = 'L' | 'P';
export type StudentStatus = 'active' | 'inactive';
export type TeacherStatus = 'active' | 'inactive';
export type ClassStatus = 'active' | 'inactive';
export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';
export type ScheduleStatus = 'active' | 'inactive';
export type AttendanceStatus = 'hadir' | 'izin' | 'sakit' | 'alpha';
export type PaymentCategory = 'registration' | 'monthly_fee' | 'other';
export type PaymentMethod = 'cash' | 'transfer' | 'other';
export type PaymentStatus = 'paid' | 'pending' | 'cancelled';
export type InvoiceStatus = 'unpaid' | 'paid' | 'overdue' | 'cancelled';
export type LandingSectionType = 'hero' | 'about' | 'features' | 'cta' | 'contact' | 'custom';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  theme_primary_color: string;
  theme_secondary_color: string;
  social_instagram: string | null;
  social_facebook: string | null;
  social_youtube: string | null;
  social_whatsapp: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Profile {
  id: string;
  organization_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Student {
  id: string;
  organization_id: string;
  nis: string;
  full_name: string;
  gender: StudentGender;
  birth_place: string | null;
  birth_date: string | null;
  address: string | null;
  phone: string | null;
  parent_name: string | null;
  parent_phone: string | null;
  school_origin: string | null;
  photo_url: string | null;
  status: StudentStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Teacher {
  id: string;
  organization_id: string;
  profile_id: string;
  subjects: string | null;
  hourly_rate: number;
  join_date: string | null;
  bio: string | null;
  status: TeacherStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Class {
  id: string;
  organization_id: string;
  teacher_id: string | null;
  name: string;
  subject: string | null;
  capacity: number;
  status: ClassStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ClassStudent {
  id: string;
  organization_id: string;
  class_id: string;
  student_id: string;
  enrolled_at: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ClassSchedule {
  id: string;
  organization_id: string;
  class_id: string;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  room: string | null;
  status: ScheduleStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface AttendanceSession {
  id: string;
  organization_id: string;
  class_id: string;
  session_date: string;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface AttendanceRecord {
  id: string;
  organization_id: string;
  session_id: string;
  student_id: string;
  status: AttendanceStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Payment {
  id: string;
  organization_id: string;
  student_id: string;
  category: PaymentCategory;
  period: string | null;
  amount: number;
  payment_date: string;
  method: PaymentMethod;
  status: PaymentStatus;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Invoice {
  id: string;
  organization_id: string;
  student_id: string;
  payment_id: string | null;
  invoice_number: string;
  description: string;
  period: string | null;
  amount: number;
  due_date: string;
  status: InvoiceStatus;
  paid_at: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface LandingSection {
  id: string;
  organization_id: string;
  section_type: LandingSectionType;
  heading: string;
  subheading: string | null;
  body: string | null;
  image_url: string | null;
  order_index: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Database {
  __InternalSupabase: {
    PostgrestVersion: '12';
  };
  public: {
    Tables: {
      organizations: {
        Row: Organization;
        Insert: Partial<Organization> & { name: string; slug: string };
        Update: Partial<Organization>;
        Relationships: [];
      };
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & {
          id: string;
          organization_id: string;
          full_name: string;
          email: string;
        };
        Update: Partial<Profile>;
        Relationships: [];
      };
      students: {
        Row: Student;
        Insert: Partial<Student> & {
          organization_id: string;
          nis: string;
          full_name: string;
          gender: StudentGender;
        };
        Update: Partial<Student>;
        Relationships: [];
      };
      teachers: {
        Row: Teacher;
        Insert: Partial<Teacher> & {
          organization_id: string;
          profile_id: string;
        };
        Update: Partial<Teacher>;
        Relationships: [];
      };
      classes: {
        Row: Class;
        Insert: Partial<Class> & {
          organization_id: string;
          name: string;
        };
        Update: Partial<Class>;
        Relationships: [];
      };
      class_students: {
        Row: ClassStudent;
        Insert: Partial<ClassStudent> & {
          organization_id: string;
          class_id: string;
          student_id: string;
        };
        Update: Partial<ClassStudent>;
        Relationships: [];
      };
      class_schedules: {
        Row: ClassSchedule;
        Insert: Partial<ClassSchedule> & {
          organization_id: string;
          class_id: string;
          day_of_week: DayOfWeek;
          start_time: string;
          end_time: string;
        };
        Update: Partial<ClassSchedule>;
        Relationships: [];
      };
      attendance_sessions: {
        Row: AttendanceSession;
        Insert: Partial<AttendanceSession> & {
          organization_id: string;
          class_id: string;
          session_date: string;
        };
        Update: Partial<AttendanceSession>;
        Relationships: [];
      };
      attendance_records: {
        Row: AttendanceRecord;
        Insert: Partial<AttendanceRecord> & {
          organization_id: string;
          session_id: string;
          student_id: string;
        };
        Update: Partial<AttendanceRecord>;
        Relationships: [];
      };
      payments: {
        Row: Payment;
        Insert: Partial<Payment> & {
          organization_id: string;
          student_id: string;
          amount: number;
          payment_date: string;
        };
        Update: Partial<Payment>;
        Relationships: [];
      };
      invoices: {
        Row: Invoice;
        Insert: Partial<Invoice> & {
          organization_id: string;
          student_id: string;
          invoice_number: string;
          description: string;
          amount: number;
          due_date: string;
        };
        Update: Partial<Invoice>;
        Relationships: [];
      };
      landing_sections: {
        Row: LandingSection;
        Insert: Partial<LandingSection> & {
          organization_id: string;
          heading: string;
        };
        Update: Partial<LandingSection>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}