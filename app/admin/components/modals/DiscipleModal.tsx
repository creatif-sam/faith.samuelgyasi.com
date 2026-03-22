import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { Disciple } from "../types";
import { createClient } from "@/lib/supabase/client";

interface DiscipleModalProps {
  disciple: Disciple | null;
  onClose: () => void;
  onSave: () => Promise<void>;
  db: ReturnType<typeof createClient>;
}

const AVAILABLE_COURSES = [
  "Foundations of Faith",
  "Prayer & Worship",
  "Bible Study Methods",
  "Spiritual Leadership",
  "Evangelism & Outreach",
  "Character Development",
  "Ministry Practicum",
  "Theology Essentials",
];

export default function DiscipleModal({ disciple, onClose, onSave, db }: DiscipleModalProps) {
  const [name, setName] = useState(disciple?.name ?? "");
  const [email, setEmail] = useState(disciple?.email ?? "");
  const [phone, setPhone] = useState(disciple?.phone ?? "");
  const [currentCourse, setCurrentCourse] = useState(disciple?.current_course ?? "");
  const [status, setStatus] = useState<'active' | 'inactive' | 'graduated'>(disciple?.status ?? "active");
  const [photoUrl, setPhotoUrl] = useState(disciple?.photo_url ?? "");
  const [notes, setNotes] = useState(disciple?.notes ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setSaving(true);
    const payload = {
      name: name.trim(),
      email: email.trim() || null,
      phone: phone.trim() || null,
      current_course: currentCourse.trim() || null,
      status,
      photo_url: photoUrl.trim() || null,
      notes: notes.trim() || null,
    };

    const { error } = disciple
      ? await db.from("disciples").update(payload).eq("id", disciple.id)
      : await db.from("disciples").insert(payload);

    setSaving(false);
    if (error) {
      toast.error("Save failed: " + error.message);
      return;
    }

    toast.success(disciple ? "Disciple updated" : "Disciple added");
    await onSave();
  }

  return (
    <div className={TW.overlay} onClick={onClose}>
      <div className={TW.panel} onClick={(e) => e.stopPropagation()}>
        <div className={TW.pHead}>
          <div className={TW.fTitle}>{disciple ? "Edit Disciple" : "Add New Disciple"}</div>
          <button className={TW.iconBtn} onClick={onClose}><X size={16} /></button>
        </div>
        <div className={TW.pBody}>
          <div className={TW.field}>
            <label className={TW.label}>Name *</label>
            <input
              className={TW.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
            />
          </div>

          <div className={TW.fRow}>
            <div className={TW.field}>
              <label className={TW.label}>Email</label>
              <input
                className={TW.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div className={TW.field}>
              <label className={TW.label}>Phone</label>
              <input
                className={TW.input}
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1234567890"
              />
            </div>
          </div>

          <div className={TW.fRow}>
            <div className={TW.field}>
              <label className={TW.label}>Current Course</label>
              <select
                className={TW.select}
                value={currentCourse}
                onChange={(e) => setCurrentCourse(e.target.value)}
              >
                <option value="">No course selected</option>
                {AVAILABLE_COURSES.map((course) => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
            <div className={TW.field}>
              <label className={TW.label}>Status</label>
              <select
                className={TW.select}
                value={status}
                onChange={(e) => setStatus(e.target.value as 'active' | 'inactive' | 'graduated')}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="graduated">Graduated</option>
              </select>
            </div>
          </div>

          <div className={TW.field}>
            <label className={TW.label}>Photo URL</label>
            <input
              className={TW.input}
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <div className={TW.field}>
            <label className={TW.label}>General Notes</label>
            <textarea
              className={cn(TW.tarea, "min-h-[100px]")}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Background, goals, special considerations..."
            />
          </div>
        </div>
        <div className={TW.pFoot}>
          <button className={cn(TW.btn, TW.ghost)} onClick={onClose}>Cancel</button>
          <button className={cn(TW.btn, TW.gold)} onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : disciple ? "Update" : "Add Disciple"}
          </button>
        </div>
      </div>
    </div>
  );
}
