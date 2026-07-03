// Dashboard types
export type DashTab = "overview" | "my-trainings" | "browse" | "habits" | "growth" | "blogs" | "profile";
export type GrowthSubTab = "messages" | "journal" | "goals";

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

export interface BlogPostSummary {
  id: string;
  title: string;
  title_fr: string | null;
  slug: string;
  category: string;
  excerpt: string | null;
  excerpt_fr: string | null;
  read_time_minutes: number;
  featured_image_url: string | null;
  created_at: string;
}

export interface MentorMessage {
  id: string;
  title: string;
  body: string | null;
  read: boolean;
  reply: string | null;
  replied_at: string | null;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  shared_with_mentor: boolean;
  created_at: string;
  updated_at: string;
}

export interface PersonalGoal {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  target_date: string | null;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}
