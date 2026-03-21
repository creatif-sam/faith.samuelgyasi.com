interface EmptySlotProps {
  label: string;
}

export function EmptySlot({ label }: EmptySlotProps) {
  return (
    <div className="up-coming-soon">
      <div className="up-coming-soon-icon">◆</div>
      <p>No {label} announced yet — check back soon.</p>
    </div>
  );
}
