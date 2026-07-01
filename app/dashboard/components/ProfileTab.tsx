"use client";
import { useState, useCallback, useEffect } from "react";
import { Camera, AlertTriangle, Save, LogOut, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { Translations, Lang } from "../translations";

interface ProfileTabProps {
  user: SupabaseUser;
  t: Translations;
  lang: Lang;
  toggleLang: () => void;
  theme: "dark" | "light";
  setTheme: (v: "dark" | "light") => void;
  myTrainingsCount: number;
  finishedCount: number;
  handleLogout: () => void;
  onNameChange: (name: string) => void;
  initials: string;
  initialName: string;
  initialAvatarUrl: string | null;
}

export default function ProfileTab({
  user,
  t,
  lang,
  toggleLang,
  theme,
  setTheme,
  myTrainingsCount,
  finishedCount,
  handleLogout,
  onNameChange,
  initials,
  initialName,
  initialAvatarUrl,
}: ProfileTabProps) {
  const router = useRouter();
  const db = createClient();

  const [profileName, setProfileName] = useState(initialName);
  const [profileAvatarUrl, setProfileAvatarUrl] = useState<string | null>(initialAvatarUrl);
  const [profileSaving, setProfileSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const loadProfile = useCallback(async () => {
    // Only fetch if initial values were not provided
    if (initialName && initialAvatarUrl !== undefined) return;
    const { data } = await db.from("user_profiles")
      .select("full_name, avatar_url")
      .eq("id", user.id)
      .single();
    if (data) {
      if (data.full_name) { setProfileName(data.full_name); onNameChange(data.full_name); }
      if (data.avatar_url) setProfileAvatarUrl(data.avatar_url);
    }
  }, [db, user.id, onNameChange, initialName, initialAvatarUrl]);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  async function saveProfile() {
    setProfileSaving(true);
    const { error: saveErr } = await db.from("user_profiles").upsert({
      id: user.id,
      full_name: profileName.trim() || null,
      avatar_url: profileAvatarUrl,
      updated_at: new Date().toISOString(),
    });
    setProfileSaving(false);
    if (saveErr) {
      toast.error("Could not save profile. Check your connection and try again.");
      console.error("saveProfile error:", saveErr);
      return;
    }
    onNameChange(profileName.trim());
    toast.success(t.profileSaved);
  }

  async function uploadAvatar(file: File) {
    setAvatarUploading(true);
    const ext = file.name.split(".").pop();
    const filePath = `${user.id}/avatar.${ext}`;
    const { error: uploadErr } = await db.storage.from("avatars").upload(filePath, file, { upsert: true });
    if (!uploadErr) {
      const { data: urlData } = db.storage.from("avatars").getPublicUrl(filePath);
      const url = urlData.publicUrl + "?t=" + Date.now();
      setProfileAvatarUrl(url);
      const { error: avatarSaveErr } = await db.from("user_profiles").upsert({
        id: user.id,
        avatar_url: url,
        updated_at: new Date().toISOString(),
      });
      if (avatarSaveErr) {
        toast.error("Avatar uploaded but could not be saved. Try again.");
        console.error("uploadAvatar upsert error:", avatarSaveErr);
      } else {
        toast.success(t.profileSaved);
      }
    } else {
      toast.error("Avatar upload failed. Please try a smaller image.");
    }
    setAvatarUploading(false);
  }

  async function handleDeleteAccount() {
    if (deleteConfirmText !== "DELETE") return;
    setDeleting(true);
    await db.from("user_profiles").delete().eq("id", user.id);
    const { error } = await db.rpc("delete_user");
    if (error) {
      toast.error("Could not delete account. Please contact support.");
      setDeleting(false);
      return;
    }
    await db.auth.signOut();
    router.push("/");
  }

  const displayName = profileName.trim() || user.email?.split("@")[0] || "Student";

  return (
    <>
      <div className="dash-page-header">
        <h1 className="dash-page-title">{t.profileTitle}</h1>
        <p className="dash-page-sub">{t.profileSub}</p>
      </div>
      <div className="dash-profile-card">

        {/* Hero: avatar + name */}
        <div className="pf-hero">
          <label className="pf-avatar-wrap" title={t.changePhoto}>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadAvatar(f);
                e.target.value = "";
              }}
            />
            {profileAvatarUrl ? (
              <img src={profileAvatarUrl} alt="avatar" className="pf-avatar-img" />
            ) : (
              <div className="pf-avatar-fallback">{initials}</div>
            )}
            {avatarUploading ? (
              <div className="pf-avatar-uploading">
                <div className="pf-avatar-spinner" />
              </div>
            ) : (
              <div className="pf-avatar-overlay">
                <Camera size={20} />
              </div>
            )}
          </label>
          <div className="pf-hero-info">
            <div className="pf-hero-name">{displayName}</div>
            <div className="pf-hero-email">{user.email}</div>
            <div className="pf-hero-role">Student</div>
          </div>
        </div>

        {/* Edit name */}
        <div className="pf-section">
          <div className="pf-section-label">{t.fullName}</div>
          <div className="pf-field">
            <label className="pf-label">{t.fullName}</label>
            <input
              className="pf-input"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder={t.fullNamePlaceholder}
              maxLength={80}
            />
          </div>
          <button className="pf-btn-save" onClick={saveProfile} disabled={profileSaving}>
            <Save size={14} />
            {profileSaving ? t.saving : t.saveProfile}
          </button>
        </div>

        {/* Account info */}
        <div className="pf-section">
          <div className="pf-section-label">{t.accountSettings}</div>
          <div className="dash-profile-row">
            <span className="dash-profile-label">{t.email}</span>
            <span className="dash-profile-value" style={{ fontSize: 12 }}>{user.email ?? "—"}</span>
          </div>
          <div className="dash-profile-row">
            <span className="dash-profile-label">{t.memberSince}</span>
            <span className="dash-profile-value">
              {user.created_at
                ? new Date(user.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                : "—"}
            </span>
          </div>
          <div className="dash-profile-row">
            <span className="dash-profile-label">{t.statsEnrolled}</span>
            <span className="dash-profile-value">{myTrainingsCount}</span>
          </div>
          <div className="dash-profile-row">
            <span className="dash-profile-label">{t.statsDone}</span>
            <span className="dash-profile-value">{finishedCount}</span>
          </div>
        </div>

        {/* Settings */}
        <div className="pf-section">
          <div className="pf-section-label">{t.accountSettings}</div>
          <div className="dash-profile-row">
            <span className="dash-profile-label">{t.language}</span>
            <div className="dash-toggle-row">
              <button className={`dash-toggle-btn${lang === "en" ? " active" : ""}`} onClick={() => lang !== "en" && toggleLang()}>EN</button>
              <button className={`dash-toggle-btn${lang === "fr" ? " active" : ""}`} onClick={() => lang !== "fr" && toggleLang()}>FR</button>
            </div>
          </div>
          <div className="dash-profile-row" style={{ borderBottom: "none" }}>
            <span className="dash-profile-label">{t.theme}</span>
            <div className="dash-toggle-row">
              <button className={`dash-toggle-btn${theme === "dark" ? " active" : ""}`} onClick={() => setTheme("dark")}>{t.dark}</button>
              <button className={`dash-toggle-btn${theme === "light" ? " active" : ""}`} onClick={() => setTheme("light")}>{t.light}</button>
            </div>
          </div>
        </div>

        {/* Log out + Danger zone */}
        <div className="pf-section" style={{ marginBottom: 0 }}>
          <button className="pf-btn-logout" onClick={handleLogout}>
            <LogOut size={16} />
            {t.signOut}
          </button>

          <div className="pf-danger-zone">
            <div className="pf-danger-title">
              <AlertTriangle size={14} />
              {t.dangerZone}
            </div>
            {!showDeleteConfirm ? (
              <>
                <p className="pf-danger-desc">{t.deleteConfirmMsg}</p>
                <button className="pf-btn-delete" onClick={() => setShowDeleteConfirm(true)}>
                  <Trash2 size={14} />
                  {t.deleteAccount}
                </button>
              </>
            ) : (
              <>
                <p className="pf-danger-desc" style={{ marginBottom: 8 }}>{t.deleteConfirmMsg}</p>
                <ul style={{ fontSize: 11, color: "var(--d-muted)", margin: "0 0 12px 16px", lineHeight: 1.8 }}>
                  <li>All lesson progress &amp; completions</li>
                  <li>Training enrollments</li>
                  <li>Spiritual habits &amp; all logs</li>
                  <li>Profile data and avatar</li>
                  <li>Your account — this cannot be undone</li>
                </ul>
                <input
                  className="pf-confirm-input"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder={t.deleteConfirmPlaceholder}
                  autoFocus
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="pf-btn-delete"
                    disabled={deleteConfirmText !== "DELETE" || deleting}
                    onClick={handleDeleteAccount}
                  >
                    {deleting ? t.deleting : t.deleteConfirmBtn}
                  </button>
                  <button
                    className="pf-btn-save"
                    style={{ background: "var(--d-soft)", color: "var(--d-text)", border: "1px solid var(--d-border)" }}
                    onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(""); }}
                  >
                    {t.deleteCancel}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </>
  );
}
