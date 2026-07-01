// Mail / communication types
export interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
  confirmed: boolean;
  interests?: string[] | null;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  created_at: string;
}

export interface EmailLog {
  id: string;
  resend_id: string | null;
  to_email: string;
  from_email: string;
  subject: string;
  body_html: string | null;
  body_text: string | null;
  status: string;
  opened_at: string | null;
  sent_at: string;
  template_id: string | null;
}

export interface TrainingEnrollment {
  id: string;
  user_id: string;
  training_id: string;
  enrolled_at: string;
}

export interface AuthUserRow {
  id: string;
  email: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body_html: string;
  body_text: string;
  category?: string | null;
  created_at: string;
}

export type CampaignRecipientType = "custom" | "subscribers";
export type CampaignStatus = "draft" | "sending" | "sent" | "failed";

export interface EmailCampaign {
  id: string;
  subject: string;
  body_html: string;
  body_text: string | null;
  template_id: string | null;
  recipient_type: CampaignRecipientType;
  recipient_filter: string | null;
  recipient_emails: string[] | null;
  total_recipients: number;
  sent_count: number;
  failed_count: number;
  status: CampaignStatus;
  created_at: string;
  updated_at: string;
  sent_at: string | null;
}

export interface InboundEmail {
  id: string;
  from_email: string;
  from_name: string | null;
  to_email: string | null;
  subject: string | null;
  body_text: string | null;
  body_html: string | null;
  read: boolean;
  received_at: string;
}

export interface PageViewRow {
  page_path: string;
  visitor_id: string;
  created_at: string;
  country: string | null;
}

export interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  topPages: { path: string; count: number }[];
  dailyViews: { date: string; count: number }[];
  countryViews: { country: string; count: number }[];
}
