import { useState } from "react";
import { Plus, Pencil, Trash2, Images, Image } from "lucide-react";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { GalleryTheme, GalleryPhoto } from "../types";

interface GalleryTabProps {
  themes: GalleryTheme[];
  onNew: () => void;
  onEdit: (t: GalleryTheme) => void;
  onDelete: (id: string, title: string) => void;
  onToggle: (id: string, val: boolean) => Promise<void>;
}

export default function GalleryTab({ themes, onNew, onEdit, onDelete, onToggle }: GalleryTabProps) {
  const published = themes.filter((t) => t.published).length;

  return (
    <>
      <div className="flex justify-between items-start mb-10 pb-7 border-b border-white/[.05]">
        <div>
          <div className={TW.pgTitle}>Photo Galleries</div>
          <p className={TW.pgSub}>{published} published · {themes.length} total themes</p>
        </div>
        <button className={cn(TW.btn, TW.gold)} onClick={onNew}>
          <Plus size={12} /> New Gallery Theme
        </button>
      </div>

      {themes.length === 0 ? (
        <p className={TW.empty}>No gallery themes yet. Create one to get started.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {themes.map((theme) => (
            <GalleryThemeRow
              key={theme.id}
              theme={theme}
              onEdit={() => onEdit(theme)}
              onDelete={() => onDelete(theme.id, theme.title)}
              onToggle={(val) => onToggle(theme.id, val)}
            />
          ))}
        </div>
      )}
    </>
  );
}

function GalleryThemeRow({
  theme,
  onEdit,
  onDelete,
  onToggle,
}: {
  theme: GalleryTheme;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: (val: boolean) => void;
}) {
  return (
    <div className="bg-[#0b0c12] border border-white/[.06] rounded-lg overflow-hidden transition-all hover:border-white/[.1]">
      <div className="flex items-center gap-4 px-5 py-4">
        {theme.cover_url ? (
          <img src={theme.cover_url} alt={theme.title} className="w-16 h-11 object-cover rounded flex-shrink-0" />
        ) : (
          <div className="w-16 h-11 rounded bg-white/[.04] flex items-center justify-center flex-shrink-0">
            <Images size={18} className="text-white/20" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="font-poppins text-[14px] font-semibold text-[#eef0f5] truncate">{theme.title}</div>
          {theme.description && (
            <div className="font-poppins text-[11px] text-white/35 mt-0.5 truncate">{theme.description}</div>
          )}
          <div className="font-poppins text-[10px] text-white/20 mt-0.5">
            {(theme.photos?.length ?? 0)} photos
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            className={cn(TW.badge, theme.published ? TW.bPub : TW.bDft, "cursor-pointer bg-transparent border-none")}
            onClick={() => onToggle(!theme.published)}
          >
            {theme.published ? "Published" : "Draft"}
          </button>
          <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={onEdit}>
            <Pencil size={10} />
          </button>
          <button className={cn(TW.btn, TW.danger, TW.sm)} onClick={onDelete}>
            <Trash2 size={10} />
          </button>
        </div>
      </div>

      {/* Photo strip preview */}
      {theme.photos && theme.photos.length > 0 && (
        <div className="border-t border-white/[.05] px-5 py-3 flex gap-2 overflow-x-auto">
          {theme.photos.map((photo) => (
            <img
              key={photo.id}
              src={photo.photo_url}
              alt={photo.caption ?? ""}
              className="h-14 w-20 object-cover rounded flex-shrink-0 border border-white/[.07]"
            />
          ))}
        </div>
      )}
    </div>
  );
}
