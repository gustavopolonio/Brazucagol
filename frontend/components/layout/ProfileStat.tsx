export function ProfileStat({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white">{label}</p>
      <p className="text-[13px] font-black uppercase tracking-[0.03em] text-(--homepage-stat-highlight)">{value}</p>
    </div>
  );
}
