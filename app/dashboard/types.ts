// Dashboard types
export type DashTab = "overview" | "my-trainings" | "browse" | "habits" | "profile";

export interface Training {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  category: string;
  total_lessons: number;
  published: boolean;
  sort_order: number;
  created_at: string;
}

export interface EnrollmentWithProgress {
  training_id: string;
  enrolled_at: string;
  completedCount: number;
}

export interface TrainingLesson {
  id: string;
  training_id: string;
  title: string;
  created_at: string;
}

export type DashNotificationKind = "admin" | "training" | "lesson" | "habit";

export interface DashNotification {
  id: string;
  kind: DashNotificationKind;
  title: string;
  body: string | null;
  created_at: string;
  read: boolean;
}

export interface SpiritualHabit {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  icon: string;
  color: string;
  frequency: string;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  logged_date: string;
}
