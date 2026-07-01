"use client";
import Link from "next/link";
import { Globe, LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_SORTED } from "./constants";
import type { Tab } from "./types";

interface Props {
  tab: Tab;
  navOpen: boolean;
  setNavOpen: (v: boolean) => void;
  unreadMsgs: number;
  unreadInbox: number;
  unreadFeedback: number;
  unprayedSubmissions: number;
  unapprovedComments: number;
  onGo: (t: Tab) => void;
  onLogout: () => void;
}

export default function AdminSidebar({ tab, navOpen, setNavOpen, unreadMsgs, unreadInbox, unreadFeedback, unprayedSubmissions, unapprovedComments, onGo, onLogout }: Props) {
  return (
    <>
      {/* Mobile header */}
      <div className="adm-mobile-header flex md:hidden fixed top-0 left-0 right-0 z-[600] border-b px-5 py-3.5 items-center justify-between shadow-[0_2px_20px_rgba(0,0,0,.4)]">
        <button
          className="bg-white/[.06] border border-white/[.09] rounded-lg text-white/60 cursor-pointer flex items-center justify-center p-1.5 transition-all hover:bg-white/10"
          onClick={() => setNavOpen(!navOpen)} aria-label="Menu"
        >
          <Menu size={18} />
        </button>
        <span className="font-poppins text-[14px] font-semibold text-[#f0ece4] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#d4a843] to-[#c49838] flex items-center justify-center text-[9px] font-bold text-[#09090d]">SG</span>
          Samuel Gyasi
        </span>
        <div className="flex items-center gap-2">
          <Link href="/" className="text-white/30 hover:text-white/60 transition-colors leading-none" aria-label="Back to Site" title="Back to Site"><Globe size={16} /></Link>
          <button onClick={onLogout} className="text-white/30 hover:text-white/60 transition-colors leading-none bg-transparent border-0 cursor-pointer p-0" aria-label="Log Out" title="Log Out">
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "adm-sidebar w-[260px] flex-shrink-0 border-r border-white/[.055]",
        "fixed md:sticky top-0 h-screen flex flex-col z-[500]",
        "shadow-[1px_0_0_0_rgba(255,255,255,.04),10px_0_50px_rgba(0,0,0,.5)]",
        "transition-transform duration-300 -translate-x-full md:translate-x-0",
        navOpen && "translate-x-0"
      )}>
        <div className="px-5 py-5 border-b border-white/[.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#d4a843] to-[#c49838] flex items-center justify-center flex-shrink-0 shadow-[0_4px_14px_rgba(212,168,67,.3)]">
              <span className="font-poppins text-[13px] font-bold text-[#09090d]">SG</span>
            </div>
            <div>
              <div className="font-poppins text-[14px] font-semibold text-[#eef0f5] leading-tight">Samuel Gyasi</div>
              <div className="font-poppins text-[10px] font-medium text-[rgba(212,168,67,.7)] mt-0.5">Admin Dashboard</div>
            </div>
          </div>
        </div>
        <nav className="px-3 pt-3 flex-1 overflow-y-auto">
          {NAV_SORTED.map(({ id, label, Icon }) => {
            const badge = id==="messages"&&unreadMsgs>0 ? unreadMsgs
              : id==="mail"&&unreadInbox>0 ? unreadInbox
              : id==="feedback"&&unreadFeedback>0 ? unreadFeedback
              : id==="prayer-submissions"&&unprayedSubmissions>0 ? unprayedSubmissions
              : id==="comments"&&unapprovedComments>0 ? unapprovedComments
              : null;
            const isActive = tab === id;
            return (
              <button key={id} onClick={() => onGo(id)}
                className={cn("flex items-center gap-3 px-4 py-2.5 font-poppins text-[13px] font-medium cursor-pointer border-0 w-full text-left transition-all duration-200 rounded-lg relative mb-1",
                  isActive ? "text-[#d4a843] bg-[rgba(212,168,67,.12)]" : "text-white/[.42] bg-transparent hover:text-white/[.80] hover:bg-white/[.05]"
                )}
              >
                <Icon size={15} />
                <span className="flex-1">{label}</span>
                {badge !== null && (
                  <span className="bg-gradient-to-br from-[#d4a843] to-[#f0cc7a] text-[#07080c] font-poppins text-[9px] font-bold px-2 py-0.5 rounded-full leading-tight ml-auto">{badge}</span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {navOpen && <div className="fixed inset-0 bg-black/65 backdrop-blur z-[490] md:hidden" onClick={() => setNavOpen(false)} />}
    </>
  );
}
