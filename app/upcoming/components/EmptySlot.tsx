import { Diamond } from "lucide-react";

interface EmptySlotProps {
  label: string;
}

export function EmptySlot({ label }: EmptySlotProps) {
  return (
    <div className="up-coming-soon">
      <div className="up-coming-soon-icon"><Diamond size={20} /></div>
      <p>{label}</p>
    </div>
  );
}
