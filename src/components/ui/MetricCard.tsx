import { cn } from "@/lib/utils";

interface MetricCardProps {
  value: string;
  label: string;
  className?: string;
}

export default function MetricCard({ value, label, className }: MetricCardProps) {
  return (
    <div className={cn("text-center", className)}>
      <div className="font-mono text-3xl font-bold text-accent lg:text-4xl">{value}</div>
      <div className="mt-1 text-xs font-medium uppercase tracking-widest text-text-1">{label}</div>
    </div>
  );
}
