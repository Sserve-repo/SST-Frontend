import React from "react";
import { DayPicker } from "react-day-picker";
import type { DayPickerProps } from "react-day-picker";

interface MultiDatePickerProps {
  selectedDates: Date[];
  onSelect: (dates: Date[] | undefined) => void;
}

const MultiDatePicker: React.FC<MultiDatePickerProps> = ({
  selectedDates,
  onSelect,
}) => {
  const classNames: DayPickerProps["classNames"] = {
    root: "w-full max-w-md",
    months: "flex flex-col",
    month: "", // Removed space-y-4
    caption: "flex justify-between pb-4 relative items-center",
    caption_label: "text-xl font-medium text-[#502266]",
    nav: "flex items-center space-x-6",
    nav_button:
      "h-6 w-6 bg-transparent hover:bg-[#E5D0EF] rounded-lg transition-colors disabled:opacity-50",
    nav_button_previous: "absolute left-1",
    nav_button_next: "absolute right-1",
    table: "w-full border-collapse", // Added border-collapse
    head_row: "flex w-full justify-between mb-2", // Changed to flex
    head_cell: "w-10 text-gray-900 font-medium text-sm text-center", // Added fixed width
    row: "flex w-full justify-between mb-2", // Changed to flex
    cell: "w-10 text-center relative", // Added fixed width
    day: "w-9 h-9 mx-auto flex items-center justify-center text-sm font-normal hover:bg-[#E5D0EF] rounded-lg transition-colors",
    day_selected:
      "[&:not([disabled])]:bg-[#E5D0EF] [&:not([disabled])]:text-[#502266]",
    day_today: "text-[#502266]",
    day_outside: "text-gray-400",
    day_disabled: "text-gray-400",
    day_hidden: "invisible",
  };

  return (
    <div className="rounded-2xl border border-gray-200 p-6 shadow-sm">
      <DayPicker
        mode="multiple"
        selected={selectedDates}
        onSelect={onSelect}
        classNames={classNames}
        modifiersClassNames={{
          selected: "bg-[#E5D0EF] text-[#502266]",
        }}
        modifiers={{
          selected: selectedDates,
        }}
        showOutsideDays
        fixedWeeks
      />
    </div>
  );
};

export default MultiDatePicker;
