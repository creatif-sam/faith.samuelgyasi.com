"use client";
import { Bell, Moon, Search, Sun } from "lucide-react";
import { NAV_SORTED } from "./constants";
import type { AdminNotification } from "./useAdminPage";
import type { Tab } from "./types";

interface Props {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  notifOpen: boolean;
  setNotifOpen: (v: boolean | ((p: boolean) => boolean)) => void;
  notifications: AdminNotification[];
  unreadNotifCount: number;
  markAllNotificationsRead: () => void;
  theme: "dark" | "light";
  setTheme: (v: "dark" | "light" | ((p: "dark" | "light") => "dark" | "light")) => void;
  adminEmail: string;
  onGo: (t: Tab) => void;
}

export default function AdminTopbar({ searchQuery, setSearchQuery, searchOpen, setSearchOpen, notifOpen, setNotifOpen, notifications, unreadNotifCount, markAllNotificationsRead, theme, setTheme, adminEmail, onGo }: Props) {
  return (
    <div className="adm-topbar mx-4 md:mx-12 mt-[62px] md:mt-6">
      <div className="adm-topbar-left">
        <div className="adm-search-wrap">
          <Search size={15} />
          <input className="adm-search" placeholder="Search tab, post, user..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 160)}
          />
        </div>
        {searchOpen && searchQuery.trim().length > 0 && (() => {
          const results = NAV_SORTED.filter(n => n.label.toLowerCase().includes(searchQuery.toLowerCase()));
          return (
            <div className="adm-search-results">
              {results.length === 0 ? (
                <p className="adm-search-no-results">No matching tabs found</p>
              ) : results.map(({ id, label, Icon }) => (
                <div key={id} className="adm-search-result-item"
                  onMouseDown={() => { onGo(id as Tab); setSearchQuery(""); setSearchOpen(false); }}
                >
                  <Icon size={14} /><span>{label}</span>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
      <div className="adm-topbar-right">
        <div className="adm-notif-wrap">
          <button className="adm-icon-btn" onClick={() => setNotifOpen(v => !v)} aria-label="Notifications">
            <Bell size={14} />
            {unreadNotifCount > 0 && <span className="adm-notif-badge">{unreadNotifCount > 9 ? "9+" : unreadNotifCount}</span>}
          </button>
          {notifOpen && (
            <div className="adm-notif-panel">
              <div className="flex items-center justify-between mb-2 px-1">
                <p className="text-[12px] font-semibold" style={{ color: "var(--adm-text)" }}>Notifications</p>
                <button className="text-[11px]" style={{ color: "#d4a843" }} onClick={markAllNotificationsRead}>Mark all read</button>
              </div>
              {notifications.length === 0 ? (
                <p className="text-[12px] px-1" style={{ color: "var(--adm-text-muted)" }}>No notifications yet.</p>
              ) : notifications.map(n => (
                <div key={n.id} className="adm-notif-item" style={{ opacity: n.read ? 0.7 : 1 }}>
                  <p className="adm-notif-title">{n.title}</p>
                  {n.body && <p className="adm-notif-body">{n.body}</p>}
                  <p className="adm-notif-time">{new Date(n.created_at).toLocaleString("en-GB")}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <button type="button" className="adm-icon-btn"
          onClick={() => setTheme(prev => prev === "dark" ? "light" : "dark")}
          aria-label="Toggle theme" title={theme === "dark" ? "Switch to light" : "Switch to dark"}
        >
          {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
        </button>
        <div className="adm-profile">
          <span className="adm-avatar">{(adminEmail[0] || "A").toUpperCase()}</span>
          <div>
            <p className="adm-pname">Admin</p>
            <p className="adm-pmail">{adminEmail}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
