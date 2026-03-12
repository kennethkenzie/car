import { LucideIcon } from "lucide-react";

const HINT_TONE: Record<"success" | "warning" | "danger" | "neutral", string> = {
  success: "text-green-500",
  warning: "text-amber-500",
  danger: "text-red-500",
  neutral: "text-gray-500",
};

export function KpiCard({
  label,
  value,
  hint,
  hintTone = "success",
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  hintTone?: "success" | "warning" | "danger" | "neutral";
  icon?: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-[#4228c4]/20 group flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-[#4228c4] transition-colors">{label}</p>
        {Icon && <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#4228c4]/10 group-hover:text-[#4228c4] transition-colors"><Icon className="h-4 w-4" /></div>}
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-black text-gray-900 tracking-tight">{value}</p>
        {hint ? <p className={`text-xs font-bold ${HINT_TONE[hintTone]}`}>{hint}</p> : null}
      </div>
    </div>
  );
}
