import {
  LayoutDashboard, BarChart3, FileText, Users, MessageSquare,
  Mail, Phone, BookOpen, Star, Calendar, MessageSquarePlus,
  GraduationCap, Images
} from "lucide-react";
import { Tab } from "./types";

export const CATEGORIES = ["faith", "problems-and-solutions", "wisdom", "leadership"] as const;
export type DefaultCategory = typeof CATEGORIES[number];
export type AnyCategory = DefaultCategory | (string & {});

export function slugify(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, 80);
}

export const NAV: { id: Tab; label: string; Icon: React.ComponentType<{ size?: number }> }[] = [
  { id: "overview",     label: "Overview",      Icon: LayoutDashboard },
  { id: "analytics",    label: "Analytics",     Icon: BarChart3       },
  { id: "posts",        label: "Blog Posts",    Icon: FileText        },
  { id: "my-story",     label: "My Story",      Icon: BookOpen        },
  { id: "credo",        label: "Credo",         Icon: FileText        },
  { id: "subscribers",  label: "Subscribers",   Icon: Users           },
  { id: "messages",     label: "Messages",      Icon: MessageSquare   },
  { id: "mail",         label: "Mail",          Icon: Mail            },
  { id: "whatsapp",     label: "WhatsApp",      Icon: Phone           },
  { id: "testimonials", label: "Testimonials",  Icon: Star            },
  { id: "library",      label: "Library",       Icon: BookOpen        },
  { id: "upcoming",     label: "Upcoming",      Icon: Calendar        },
  { id: "feedback",     label: "Feedback",      Icon: MessageSquarePlus },
  { id: "trainings",    label: "Trainings",     Icon: GraduationCap     },
  { id: "gallery",      label: "Gallery",       Icon: Images            },
];

// TAILWIND CLASS CONSTANTS
export const TW = {
  // Buttons
  btn:     "inline-flex items-center gap-2 font-poppins text-[11px] font-medium cursor-pointer rounded-lg transition-all duration-200 active:scale-[.97] border-0",
  gold:    "bg-gradient-to-br from-[#d4a843] to-[#c49838] text-[#09090d] px-5 py-2.5 shadow-[0_2px_12px_rgba(212,168,67,.25)] hover:from-[#e0b84e] hover:to-[#d4a843] hover:shadow-[0_4px_18px_rgba(212,168,67,.4)]",
  ghost:   "bg-white/5 text-white/50 border border-white/10 px-5 py-2.5 hover:bg-white/[.09] hover:text-white/85 hover:border-white/[.18]",
  danger:  "bg-red-500/10 text-red-400 border border-red-500/20 px-5 py-2.5 hover:bg-red-500/[.18] hover:border-red-500/30",
  sm:      "!px-3 !py-1.5 !text-[10px] !rounded-lg gap-1",
  // Badges
  badge:   "font-poppins text-[10px] font-medium px-2.5 py-0.5 inline-block rounded-full",
  bPub:    "bg-[rgba(212,168,67,.12)] text-[#d4a843] border border-[rgba(212,168,67,.2)]",
  bDft:    "bg-white/[.06] text-white/40 border border-white/[.08]",
  bSent:   "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  bOpen:   "bg-green-500/10 text-green-400 border border-green-500/20",
  bNew:    "bg-[rgba(212,168,67,.16)] text-[#d4a843] border border-[rgba(212,168,67,.25)]",
  // Form
  field:   "mb-5",
  label:   "font-poppins text-[11px] font-medium text-white/50 block mb-2",
  input:   "w-full bg-white/[.04] border border-white/[.09] rounded-lg text-[#eef0f5] font-poppins text-sm px-4 py-3 outline-none transition-all focus:border-[rgba(212,168,67,.5)] focus:bg-white/[.06] focus:shadow-[0_0_0_3px_rgba(212,168,67,.08)]",
  select:  "w-full bg-white/[.04] border border-white/[.09] rounded-lg text-[#eef0f5] font-poppins text-sm px-4 py-3 outline-none transition-all focus:border-[rgba(212,168,67,.5)] focus:bg-white/[.06] focus:shadow-[0_0_0_3px_rgba(212,168,67,.08)]",
  tarea:   "w-full bg-white/[.04] border border-white/[.09] rounded-lg text-[#eef0f5] font-poppins text-sm px-4 py-3 outline-none transition-all focus:border-[rgba(212,168,67,.5)] focus:bg-white/[.06] focus:shadow-[0_0_0_3px_rgba(212,168,67,.08)] resize-y min-h-[200px]",
  // Typography
  pgTitle: "font-poppins text-[30px] font-bold text-[#eef0f5] leading-tight tracking-tight",
  pgSub:   "font-poppins text-[13px] text-white/40 mt-1.5",
  sTitle:  "font-poppins text-[18px] font-semibold text-[#eef0f5]",
  sHead:   "flex justify-between items-center mb-6",
  // Table
  tWrap:   "overflow-x-auto rounded-lg border border-white/[.06] overflow-hidden",
  th:      "font-poppins text-[11px] font-semibold text-white/[.35] px-5 py-3.5 text-left border-b border-white/[.06] bg-white/[.025] whitespace-nowrap",
  td:      "px-5 py-4 text-sm text-white/60 border-b border-white/[.04] align-middle font-poppins",
  // Actions
  actRow:  "flex gap-1.5 items-center flex-wrap",
  // Empty
  empty:   "font-poppins text-base text-white/25 py-16 text-center",
  // Overlay / modal
  overlay: "fixed inset-0 bg-black/[.82] backdrop-blur-xl z-[9000] flex items-center justify-center p-5",
  modal:   "bg-[#0b0c12] border border-white/[.08] rounded-lg w-full max-w-[720px] max-h-[90vh] overflow-y-auto p-10 shadow-[0_32px_80px_rgba(0,0,0,.7),0_0_0_1px_rgba(255,255,255,.04)]",
  panel:   "bg-[#0b0c12] border border-white/[.08] rounded-lg w-full max-w-[640px] max-h-[90vh] overflow-y-auto flex flex-col shadow-[0_32px_80px_rgba(0,0,0,.7),0_0_0_1px_rgba(255,255,255,.04)]",
  pHead:   "flex justify-between items-center px-7 py-6 border-b border-white/[.06] flex-shrink-0",
  pBody:   "p-7 flex-1 overflow-y-auto",
  pFoot:   "flex gap-2.5 justify-end px-7 py-5 border-t border-white/[.055] bg-black/[.12] flex-shrink-0 rounded-b-2xl",
  fTitle:  "font-poppins text-[20px] font-bold text-[#eef0f5]",
  // Message cards
  msgCard: "bg-[#0b0c12] border border-white/[.06] border-l-[3px] border-l-transparent rounded-lg p-5 transition-all duration-200 mb-2 hover:border-l-[rgba(212,168,67,.35)] hover:shadow-[0_4px_20px_rgba(0,0,0,.25)]",
  msgNew:  "!bg-[rgba(212,168,67,.03)] !border-[rgba(212,168,67,.15)] !border-l-[rgba(212,168,67,.6)]",
  msgHead: "flex justify-between items-start gap-4 flex-wrap",
  msgName: "font-poppins text-[15px] font-semibold text-[#eef0f5] flex items-center gap-2 flex-wrap",
  msgMeta: "font-poppins text-[11px] text-white/[.35] mt-1",
  msgSubj: "font-poppins text-[12px] italic text-white/45 mt-1",
  msgBody: "mt-4 pt-4 border-t border-white/[.05] font-poppins text-sm leading-[1.8] text-white/[.65] break-words",
  // Mail sub-nav
  mNav:    "flex gap-1 mb-8 overflow-x-auto bg-white/[.03] border border-white/[.06] rounded-lg p-1",
  mTab:    "flex items-center gap-2 px-4 py-2.5 font-poppins text-[12px] font-medium text-white/40 bg-transparent border-0 cursor-pointer rounded-lg flex-shrink-0 transition-all whitespace-nowrap hover:text-white/75 hover:bg-white/5",
  mAct:    "!text-[#d4a843] !bg-[rgba(212,168,67,.1)]",
  // Stats
  stat:    "bg-[#0b0c12] p-6 border border-white/[.06] rounded-lg relative overflow-hidden cursor-default transition-all duration-[250ms] group hover:border-[rgba(212,168,67,.22)] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,.4),0_0_0_1px_rgba(212,168,67,.1)]",
  statNum: "font-poppins text-[36px] font-bold leading-none mb-2 bg-gradient-to-br from-[#d4a843] to-[#f0cc7a] bg-clip-text text-transparent",
  statLbl: "font-poppins text-[12px] font-medium text-white/[.40]",
  // Icon button
  iconBtn: "bg-white/5 border border-white/[.08] text-white/40 cursor-pointer p-2 rounded-lg flex items-center transition-all hover:bg-white/10 hover:text-white/80",
  // Quick reply
  qReply:  "mt-4 p-5 bg-white/[.02] border-t border-white/5 border-l-[3px] border-l-[rgba(212,168,67,.25)] rounded-b-xl",
  // WA
  waCard:  "bg-[#0b0c12] border border-white/[.06] rounded-lg p-7",
  // Compose
  compose: "max-w-[780px]",
  // Form row
  fRow:    "grid grid-cols-2 gap-4",
};
