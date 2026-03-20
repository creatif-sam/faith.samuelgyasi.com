export default function MiniBarChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="flex items-end gap-1 h-[140px] bg-[#0d0e15] border border-white/[.06] rounded-lg px-4 pt-4 pb-8 overflow-x-auto mb-2">
      {data.map((d) => (
        <div key={d.date} className="flex-1 min-w-[20px] flex flex-col items-center justify-end h-full relative" title={`${d.date}: ${d.count}`}>
          <div
            className="w-full max-w-[28px] bg-gradient-to-t from-[#d4a843] to-[rgba(212,168,67,.25)] rounded-t-sm min-h-[3px] transition-all duration-[450ms]"
            style={{ height: `${Math.max((d.count / max) * 100, 2)}%` }}
          />
          <div className="absolute bottom-[-26px] font-mono text-[7px] text-white/20 whitespace-nowrap tracking-[.03em] text-center">
            {new Date(d.date + "T12:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
          </div>
        </div>
      ))}
    </div>
  );
}
