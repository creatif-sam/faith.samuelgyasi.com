import { Plus, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { EmailTemplate } from "../types";

interface TplsViewProps {
  templates: EmailTemplate[];
  onNew: () => void;
  onEdit: (t: EmailTemplate) => void;
  onDelete: (id: string, name: string) => void;
}

export default function TplsView({ templates, onNew, onEdit, onDelete }: TplsViewProps) {
  return (
    <>
      <div className={TW.sHead}>
        <div className={TW.sTitle}>Email Templates</div>
        <button className={cn(TW.btn, TW.gold)} onClick={onNew}><Plus size={10} />New Template</button>
      </div>

      {templates.length === 0 ? <p className={TW.empty}>No templates. Create reusable email layouts.</p> : (
        <div className={TW.tWrap}>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={TW.th}>Template Name</th>
                <th className={TW.th}>Category</th>
                <th className={TW.th}>Subject</th>
                <th className={TW.th}>Status</th>
                <th className={TW.th}>Last Updated</th>
                <th className={TW.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((t) => (
                <tr key={t.id} className="hover:[&>td]:bg-[rgba(212,168,67,.04)]">
                  <td className={TW.td} style={{ color: "#f0ece4" }}>{t.name}</td>
                  <td className={TW.td}>
                    {t.category ? <span className={cn(TW.badge, TW.bNew)}>{t.category}</span> : <span className="text-white/30">—</span>}
                  </td>
                  <td className={TW.td} style={{ maxWidth: 280 }}>{t.subject}</td>
                  <td className={TW.td}><span className={cn(TW.badge, TW.bPub)}>Active</span></td>
                  <td className={TW.td}>{new Date(t.created_at).toLocaleDateString("en-GB")}</td>
                  <td className={TW.td}>
                    <div className={TW.actRow}>
                      <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => onEdit(t)}><Pencil size={9} /></button>
                      <button className={cn(TW.btn, TW.danger, TW.sm)} onClick={() => onDelete(t.id, t.name)}><Trash2 size={9} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
