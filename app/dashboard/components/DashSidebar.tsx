"use client";
import { LogOut } from "lucide-react";
import type { DashTab } from "../types";
import type { Translations } from "../translations";

interface NavItem {
  id: DashTab;
  label: string;
  Icon: React.ComponentType<{ size?: number }>;
  count?: number;
}

interface DashSidebarProps {
  navOpen: boolean;
  activeTab: DashTab;
  displayName: string;
  initials: string;
  avatarUrl: string | null;
  email: string;
  t: Translations;
  navItems: NavItem[];
  onTabChange: (tab: DashTab) => void;
  onLogout: () => void;
}

export default function DashSidebar({
  navOpen,
  activeTab,
  displayName,
  initials,
  avatarUrl,
  email,
  t,
  navItems,
  onTabChange,
  onLogout,
}: DashSidebarProps) {
  return (
    <aside className={`dash-sidebar${navOpen ? " open" : ""}`}>
      <div className="dash-brand">
        <span className="dash-brand-dot" />
        <span className="dash-brand-name">{t.brand}</span>
      </div>

      <div className="dash-sidebar-user">
        <div className="dash-sidebar-avatar">
          {avatarUrl
            ? <img src={avatarUrl} alt={displayName} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
            : initials}
        </div>
        <div>
          <p className="dash-user-name">{displayName}</p>
          <p className="dash-user-email">{email}</p>
        </div>
      </div>

      <div className="dash-nav-section" />

      {navItems.map(({ id, label, Icon, count }) => (
        <button
          key={id}
          className={`dash-nav-item${activeTab === id ? " active" : ""}`}
          onClick={() => onTabChange(id)}
        >
          <Icon size={15} />
          <span>{label}</span>
          {count !== undefined && count > 0 && (
            <span className="dash-nav-badge">{count}</span>
          )}
        </button>
      ))}

      <div className="dash-sidebar-spacer" />

      <button className="dash-logout" onClick={onLogout}>
        <LogOut size={14} />
        <span>{t.signOut}</span>
      </button>
    </aside>
  );
}
