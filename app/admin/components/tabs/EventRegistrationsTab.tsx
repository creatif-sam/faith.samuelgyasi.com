import { useState, useEffect } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import { TW } from "../constants";
import { UpcomingEvent } from "../types";

interface EventRegistration {
  id: string;
  event_id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  registered_at: string;
}

interface EventRegistrationsTabProps {
  events: UpcomingEvent[];
  db: SupabaseClient;
}

export default function EventRegistrationsTab({ events, db }: EventRegistrationsTabProps) {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRegistrations();
  }, [selectedEvent]);

  const loadRegistrations = async () => {
    setLoading(true);
    let query = db.from("event_registrations").select("*").order("registered_at", { ascending: false });
    
    if (selectedEvent !== "all") {
      query = query.eq("event_id", selectedEvent);
    }
    
    const { data } = await query;
    setRegistrations((data as EventRegistration[]) ?? []);
    setLoading(false);
  };

  const getEventTitle = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    return event?.title ?? "Unknown Event";
  };

  const groupedByEvent = registrations.reduce((acc, reg) => {
    if (!acc[reg.event_id]) {
      acc[reg.event_id] = [];
    }
    acc[reg.event_id].push(reg);
    return acc;
  }, {} as Record<string, EventRegistration[]>);

  return (
    <>
      <div className="flex justify-between items-start mb-10 pb-7 border-b border-white/[.05]">
        <div>
          <div className={TW.pgTitle}>Event Registrations</div>
          <p className={TW.pgSub}>{registrations.length} total registrations</p>
        </div>
        <select 
          value={selectedEvent} 
          onChange={(e) => setSelectedEvent(e.target.value)}
          className={TW.select + " !w-auto"}
        >
          <option value="all">All Events</option>
          {events.filter(e => e.needs_registration).map(event => (
            <option key={event.id} value={event.id}>{event.title}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className={TW.empty}>Loading...</p>
      ) : registrations.length === 0 ? (
        <p className={TW.empty}>No registrations yet.</p>
      ) : selectedEvent !== "all" ? (
        <div className={TW.tWrap}>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={TW.th}>Name</th>
                <th className={TW.th}>Email</th>
                <th className={TW.th}>Phone</th>
                <th className={TW.th}>Message</th>
                <th className={TW.th}>Registered</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
                <tr key={reg.id} className="hover:[&>td]:bg-[rgba(212,168,67,.04)]">
                  <td className={TW.td} style={{ color: "#f0ece4", fontWeight: 500 }}>{reg.name}</td>
                  <td className={TW.td} style={{ fontSize: "12px" }}>{reg.email}</td>
                  <td className={TW.td} style={{ fontSize: "12px" }}>{reg.phone ?? "—"}</td>
                  <td className={TW.td} style={{ fontSize: "11px", maxWidth: "200px" }}>{reg.message ?? "—"}</td>
                  <td className={TW.td} style={{ fontSize: "11px", whiteSpace: "nowrap" }}>
                    {new Date(reg.registered_at).toLocaleDateString()} {new Date(reg.registered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedByEvent).map(([eventId, regs]) => (
            <div key={eventId}>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[.08]">
                <h3 className={TW.sTitle}>{getEventTitle(eventId)}</h3>
                <span className={TW.badge + " " + TW.bPub}>{regs.length} registrations</span>
              </div>
              <div className={TW.tWrap}>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className={TW.th}>Name</th>
                      <th className={TW.th}>Email</th>
                      <th className={TW.th}>Phone</th>
                      <th className={TW.th}>Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regs.map((reg) => (
                      <tr key={reg.id} className="hover:[&>td]:bg-[rgba(212,168,67,.04)]">
                        <td className={TW.td} style={{ color: "#f0ece4", fontWeight: 500 }}>{reg.name}</td>
                        <td className={TW.td} style={{ fontSize: "12px" }}>{reg.email}</td>
                        <td className={TW.td} style={{ fontSize: "12px" }}>{reg.phone ?? "—"}</td>
                        <td className={TW.td} style={{ fontSize: "11px", whiteSpace: "nowrap" }}>
                          {new Date(reg.registered_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
