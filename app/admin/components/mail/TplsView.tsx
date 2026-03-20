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
        <div className="flex flex-col gap-0.5">
          {templates.map((t) => (
            <div key={t.id} className={TW.msgCard}>
              <div className={TW.msgHead}>
                <div>
                  <div className={TW.msgName}>{t.name}</div>
                  <div className={TW.msgSubj} style={{ marginTop: 3 }}>{t.subject}</div>
                  <div className={TW.msgMeta} style={{ marginTop: 3 }}>Created {new Date(t.created_at).toLocaleDateString("en-GB")} · {t.body_html.length} HTML chars</div>
                </div>
                <div className={cn(TW.actRow, "flex-shrink-0")}>
                  <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => onEdit(t)}><Pencil size={9} /></button>
                  <button className={cn(TW.btn, TW.danger, TW.sm)} onClick={() => onDelete(t.id, t.name)}><Trash2 size={9} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
