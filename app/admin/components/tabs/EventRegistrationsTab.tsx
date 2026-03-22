import { useState, useEffect } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
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

interface RecordingRequest {
  id: string;
  event_id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  requested_at: string;
}

interface EventRegistrationsTabProps {
  events: UpcomingEvent[];
  db: SupabaseClient;
}

export default function EventRegistrationsTab({ events, db }: EventRegistrationsTabProps) {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [recordingRequests, setRecordingRequests] = useState<RecordingRequest[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const [viewType, setViewType] = useState<"registrations" | "recordings">("registrations");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedEvent]);

  const loadData = async () => {
    setLoading(true);
    
    // Load registrations
    let regQuery = db.from("event_registrations").select("*").order("registered_at", { ascending: false });
    if (selectedEvent !== "all") {
      regQuery = regQuery.eq("event_id", selectedEvent);
    }
    const { data: regData } = await regQuery;
    setRegistrations((regData as EventRegistration[]) ?? []);

    // Load recording requests
    let recQuery = db.from("recording_requests").select("*").order("requested_at", { ascending: false });
    if (selectedEvent !== "all") {
      recQuery = recQuery.eq("event_id", selectedEvent);
    }
    const { data: recData } = await recQuery;
    setRecordingRequests((recData as RecordingRequest[]) ?? []);
    
    setLoading(false);
  };

  const getEventTitle = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    return event?.title ?? "Unknown Event";
  };

  const groupedRegistrations = registrations.reduce((acc, reg) => {
    if (!acc[reg.event_id]) acc[reg.event_id] = [];
    acc[reg.event_id].push(reg);
    return acc;
  }, {} as Record<string, EventRegistration[]>);

  const groupedRecordings = recordingRequests.reduce((acc, req) => {
    if (!acc[req.event_id]) acc[req.event_id] = [];
    acc[req.event_id].push(req);
    return acc;
  }, {} as Record<string, RecordingRequest[]>);

  const currentData = viewType === "registrations" ? registrations : recordingRequests;
  const currentGrouped = viewType === "registrations" ? groupedRegistrations : groupedRecordings;

  return (
    <>
      <div className="flex justify-between items-start mb-6 pb-7 border-b border-white/[.05]">
        <div>
          <div className={TW.pgTitle}>Event Registrations & Recordings</div>
          <p className={TW.pgSub}>
            {registrations.length} registrations · {recordingRequests.length} recording requests
          </p>
        </div>
        <select 
          value={selectedEvent} 
          onChange={(e) => setSelectedEvent(e.target.value)}
          className={TW.select + " !w-auto"}
        >
          <option value="all">All Events</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>{event.title}</option>
          ))}
        </select>
      </div>

      {/* View Type Tabs */}
      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => setViewType("registrations")}
          className={cn(TW.btn, TW.sm, viewType === "registrations" ? TW.gold : TW.ghost)}
        >
          Registrations ({registrations.length})
        </button>
        <button 
          onClick={() => setViewType("recordings")}
          className={cn(TW.btn, TW.sm, viewType === "recordings" ? TW.gold : TW.ghost)}
        >
          Recording Requests ({recordingRequests.length})
        </button>
      </div>

      {loading ? (
        <p className={TW.empty}>Loading...</p>
      ) : currentData.length === 0 ? (
        <p className={TW.empty}>
          No {viewType === "registrations" ? "registrations" : "recording requests"} yet.
        </p>
      ) : selectedEvent !== "all" ? (
        <div className={TW.tWrap}>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={TW.th}>Name</th>
                <th className={TW.th}>Email</th>
                <th className={TW.th}>Phone</th>
                <th className={TW.th}>Message</th>
                <th className={TW.th}>{viewType === "registrations" ? "Registered" : "Requested"}</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item) => (
                <tr key={item.id} className="hover:[&>td]:bg-[rgba(212,168,67,.04)]">
                  <td className={TW.td} style={{ color: "#f0ece4", fontWeight: 500 }}>{item.name}</td>
                  <td className={TW.td} style={{ fontSize: "12px" }}>{item.email}</td>
                  <td className={TW.td} style={{ fontSize: "12px" }}>{item.phone ?? "—"}</td>
                  <td className={TW.td} style={{ fontSize: "11px", maxWidth: "200px" }}>{item.message ?? "—"}</td>
                  <td className={TW.td} style={{ fontSize: "11px", whiteSpace: "nowrap" }}>
                    {new Date(viewType === "registrations" ? (item as EventRegistration).registered_at : (item as RecordingRequest).requested_at).toLocaleDateString()}{" "}
                    {new Date(viewType === "registrations" ? (item as EventRegistration).registered_at : (item as RecordingRequest).requested_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(currentGrouped).map(([eventId, items]) => (
            <div key={eventId}>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[.08]">
                <h3 className={TW.sTitle}>{getEventTitle(eventId)}</h3>
                <span className={TW.badge + " " + TW.bPub}>
                  {items.length} {viewType === "registrations" ? "registrations" : "requests"}
                </span>
              </div>
              <div className={TW.tWrap}>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className={TW.th}>Name</th>
                      <th className={TW.th}>Email</th>
                      <th className={TW.th}>Phone</th>
                      <th className={TW.th}>{viewType === "registrations" ? "Registered" : "Requested"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item: EventRegistration | RecordingRequest) => (
                      <tr key={item.id} className="hover:[&>td]:bg-[rgba(212,168,67,.04)]">
                        <td className={TW.td} style={{ color: "#f0ece4", fontWeight: 500 }}>{item.name}</td>
                        <td className={TW.td} style={{ fontSize: "12px" }}>{item.email}</td>
                        <td className={TW.td} style={{ fontSize: "12px" }}>{item.phone ?? "—"}</td>
                        <td className={TW.td} style={{ fontSize: "11px", whiteSpace: "nowrap" }}>
                          {new Date(viewType === "registrations" ? (item as EventRegistration).registered_at : (item as RecordingRequest).requested_at).toLocaleDateString()}
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
