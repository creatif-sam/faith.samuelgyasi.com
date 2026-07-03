"use client";
import { useState } from "react";
import { MessageCircle, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { MentorMessage } from "../types";
import type { Translations } from "../translations";

interface MessagesTabProps {
  messages: MentorMessage[];
  t: Translations;
  onReplySent: (id: string, reply: string) => void;
}

export default function MessagesTab({ messages, t, onReplySent }: MessagesTabProps) {
  const db = createClient();
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [sendingId, setSendingId] = useState<string | null>(null);

  async function sendReply(id: string) {
    const reply = (replyDrafts[id] ?? "").trim();
    if (!reply) return;
    setSendingId(id);
    const { error } = await db.from("user_notifications")
      .update({ reply, replied_at: new Date().toISOString(), read: true })
      .eq("id", id);
    setSendingId(null);
    if (error) {
      toast.error("Could not send your reply. Please try again.");
      return;
    }
    toast.success(t.replySent);
    setReplyDrafts((prev) => ({ ...prev, [id]: "" }));
    onReplySent(id, reply);
  }

  return (
    <>
      <div className="dash-page-header">
        <h1 className="dash-page-title">{t.messagesTitle}</h1>
        <p className="dash-page-sub">{t.messagesSub}</p>
      </div>

      {messages.length === 0 ? (
        <div className="dash-empty">
          <Sparkles size={32} style={{ margin: "0 auto 12px", color: "rgba(212,168,67,.3)", display: "block" }} />
          {t.messagesEmpty}
        </div>
      ) : (
        <div className="msg-list">
          {messages.map((m) => (
            <div key={m.id} className={`msg-card${m.read ? "" : " unread"}`}>
              <div className="msg-card-head">
                <MessageCircle size={14} />
                <span className="msg-card-title">{m.title}</span>
                <span className="msg-card-time">{new Date(m.created_at).toLocaleDateString()}</span>
              </div>
              {m.body && <p className="msg-card-body">{m.body}</p>}

              {m.reply ? (
                <div className="msg-reply-sent">
                  <div className="msg-reply-label">{t.yourReply}</div>
                  <p>{m.reply}</p>
                </div>
              ) : (
                <div className="msg-reply-form">
                  <textarea
                    className="msg-reply-input"
                    placeholder={t.replyPlaceholder}
                    value={replyDrafts[m.id] ?? ""}
                    onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [m.id]: e.target.value }))}
                  />
                  <button
                    className="dash-btn dash-btn-gold"
                    style={{ width: "auto", display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px" }}
                    disabled={sendingId === m.id || !(replyDrafts[m.id] ?? "").trim()}
                    onClick={() => sendReply(m.id)}
                  >
                    <Send size={12} /> {sendingId === m.id ? "…" : t.replySend}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
