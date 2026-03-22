import { Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { BlogTag } from "../types";

interface BlogTagsTabProps {
  tags: BlogTag[];
  onNew: () => void;
  onEdit: (tag: BlogTag) => void;
  onDelete: (id: string) => Promise<void>;
  onToggle: (id: string, field: "published", currentValue: boolean) => Promise<void>;
}

export default function BlogTagsTab({ tags, onNew, onEdit, onDelete, onToggle }: BlogTagsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Blog Tags</h2>
          <p className="text-sm text-white/40 mt-1">Manage tags for categorizing blog posts</p>
        </div>
        <button className={cn(TW.btn, TW.gold)} onClick={onNew}>+ New Tag</button>
      </div>

      {tags.length === 0 ? (
        <div className="text-center py-16 text-white/30 text-sm">
          No tags created yet. Click "New Tag" to create one.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-white/50 text-xs uppercase tracking-wider">Tag Name</th>
                <th className="text-left py-3 px-4 text-white/50 text-xs uppercase tracking-wider">Slug</th>
                <th className="text-left py-3 px-4 text-white/50 text-xs uppercase tracking-wider">Color</th>
                <th className="text-center py-3 px-4 text-white/50 text-xs uppercase tracking-wider">Published</th>
                <th className="text-center py-3 px-4 text-white/50 text-xs uppercase tracking-wider">Sort Order</th>
                <th className="text-right py-3 px-4 text-white/50 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tags.map((tag) => (
                <tr key={tag.id} className="border-b border-white/5 hover:bg-white/[.02]">
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-white/90 font-medium text-sm">{tag.name_en}</span>
                      <span className="text-white/40 text-xs">{tag.name_fr}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <code className="text-white/60 text-xs bg-white/5 px-2 py-1 rounded">{tag.slug}</code>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded border border-white/10" 
                        style={{ backgroundColor: tag.color }}
                      />
                      <code className="text-white/40 text-xs">{tag.color}</code>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => onToggle(tag.id, "published", tag.published)}
                      className={cn(TW.badge, tag.published ? TW.bPub : TW.bDft, "cursor-pointer hover:opacity-80")}
                    >
                      {tag.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-white/50 text-sm">{tag.sort_order}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className={cn(TW.iconBtn, "!text-white/50 hover:!text-white/90")}
                        onClick={() => onEdit(tag)}
                        title="Edit tag"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className={cn(TW.iconBtn, "!text-red-400/50 hover:!text-red-400")}
                        onClick={() => {
                          if (confirm(`Delete tag "${tag.name_en}"? This will remove it from all posts.`)) {
                            onDelete(tag.id);
                          }
                        }}
                        title="Delete tag"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
