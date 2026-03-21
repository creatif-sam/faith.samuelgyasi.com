export interface UpcomingEvent {
  id: string;
  title: string;
  description: string | null;
  date_text: string | null;
  event_date: string | null;
  location: string | null;
  tag: string | null;
  category: "intervention" | "masterclass" | "session";
  format: "online" | "in-person" | "both";
  needs_registration: boolean;
  join_url: string | null;
  facebook_url: string | null;
  host_name: string | null;
  host_url: string | null;
  flyer_url: string | null;
  recording_signup: boolean;
}

export function isPast(ev: UpcomingEvent): boolean {
  if (!ev.event_date) return false;
  return new Date(ev.event_date) < new Date(new Date().toDateString());
}

export function displayDate(ev: UpcomingEvent): string {
  if (ev.date_text) return ev.date_text;
  if (ev.event_date) {
    return new Date(ev.event_date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
  return "Coming Soon";
}

export const FORMAT_LABEL: Record<string, string> = {
  online: "Online",
  "in-person": "In Person",
  both: "Online + In Person",
};
