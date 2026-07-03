"use client";
import { useState } from "react";
import { MessageCircle, BookMarked, Target } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { MentorMessage, JournalEntry, PersonalGoal, GrowthSubTab } from "../types";
import type { Translations } from "../translations";
import MessagesTab from "./MessagesTab";
import JournalTab from "./JournalTab";
import GoalsTab from "./GoalsTab";

interface GrowthTabProps {
  user: SupabaseUser;
  t: Translations;
  messages: MentorMessage[];
  onReplySent: (id: string, reply: string) => void;
  journalEntries: JournalEntry[];
  setJournalEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
  goals: PersonalGoal[];
  setGoals: React.Dispatch<React.SetStateAction<PersonalGoal[]>>;
}

export default function GrowthTab({
  user, t, messages, onReplySent, journalEntries, setJournalEntries, goals, setGoals,
}: GrowthTabProps) {
  const [sub, setSub] = useState<GrowthSubTab>("messages");
  const unreadMessages = messages.filter((m) => !m.read).length;

  const SUB_ITEMS: { id: GrowthSubTab; label: string; Icon: React.ComponentType<{ size?: number }>; count?: number }[] = [
    { id: "messages", label: t.messages, Icon: MessageCircle, count: unreadMessages },
    { id: "journal",  label: t.journal,  Icon: BookMarked },
    { id: "goals",    label: t.goals,    Icon: Target },
  ];

  return (
    <>
      <div className="gr-subnav">
        {SUB_ITEMS.map(({ id, label, Icon, count }) => (
          <button
            key={id}
            type="button"
            className={`gr-subnav-item${sub === id ? " active" : ""}`}
            onClick={() => setSub(id)}
          >
            <Icon size={14} />
            <span>{label}</span>
            {!!count && <span className="gr-subnav-badge">{count}</span>}
          </button>
        ))}
      </div>

      {sub === "messages" && <MessagesTab messages={messages} t={t} onReplySent={onReplySent} />}
      {sub === "journal" && <JournalTab user={user} t={t} entries={journalEntries} setEntries={setJournalEntries} />}
      {sub === "goals" && <GoalsTab user={user} t={t} goals={goals} setGoals={setGoals} />}
    </>
  );
}
