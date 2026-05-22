"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface CalendarPickerProps {
  onSelect: (date: string) => void;
  selected?: string;
}

export default function CalendarPicker({ onSelect, selected }: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = currentMonth.getDay();
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

  const monthName = currentMonth.toLocaleDateString("it-IT", { month: "long", year: "numeric" });

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
    return {
      day: i + 1,
      dateStr: date.toISOString().split("T")[0],
      isPast: date < today,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
    };
  });

  return (
    <div>
      {/* Month navigation */}
      <div className="mb-4 flex items-center justify-between">
        <button onClick={prevMonth} className="px-3 py-1 font-mono text-sm text-text-1 transition-colors hover:text-text-0">&larr;</button>
        <span className="font-mono text-sm font-medium uppercase tracking-wider text-text-0">{monthName}</span>
        <button onClick={nextMonth} className="px-3 py-1 font-mono text-sm text-text-1 transition-colors hover:text-text-0">&rarr;</button>
      </div>

      {/* Weekday headers */}
      <div className="mb-2 grid grid-cols-7">
        {["LUN", "MAR", "MER", "GIO", "VEN", "SAB", "DOM"].map((d) => (
          <div key={d} className="py-2 text-center font-mono text-[10px] tracking-wider text-text-1" style={{ letterSpacing: "1px" }}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: adjustedFirstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map(({ day, dateStr, isPast, isWeekend }) => (
          <button
            key={day}
            disabled={isPast || isWeekend}
            onClick={() => onSelect(dateStr)}
            className={cn(
              "aspect-square flex items-center justify-center font-mono text-sm transition-all duration-150",
              isPast || isWeekend
                ? "cursor-not-allowed text-text-2/40"
                : "text-text-0 hover:bg-accent/20 hover:text-accent",
              selected === dateStr && "bg-accent text-bg-0 font-bold hover:bg-accent hover:text-bg-0"
            )}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
}
