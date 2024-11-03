import React from "react";
import { DayPicker, SelectMultipleEventHandler } from "react-day-picker";
import { format } from "date-fns";

// CSS classes for the calendar
const classNames = {
  root: "w-full max-w-md p-4",
  months: "flex flex-col",
  month: "space-y-4",
  caption: "flex justify-between pt-1 relative items-center",
  caption_label: "text-lg font-medium text-purple-900",
  nav: "flex items-center",
  nav_button:
    "h-6 w-6 bg-transparent hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50",
  nav_button_previous: "absolute left-1",
  nav_button_next: "absolute right-1",
  table: "w-full border-collapse space-y-1",
  head_row: "flex",
  head_cell:
    "text-gray-500 rounded-md w-9 font-normal text-[0.8rem] flex-1 text-center",
  row: "flex w-full mt-2",
  cell: "text-center text-sm relative p-0 flex-1",
  day: "h-9 w-9 p-0 font-normal mx-auto hover:bg-purple-50 rounded-lg transition-colors",
  day_range_end: "day-range-end",
  day_selected:
    "bg-purple-100 text-purple-900 hover:bg-purple-200 hover:text-purple-900 rounded-lg focus:bg-purple-100 focus:text-purple-900",
  day_today: "text-purple-900 bg-purple-50/50",
  day_outside: "text-gray-400",
  day_disabled: "text-gray-400",
  day_hidden: "invisible",
};

interface MultiDatePickerProps {
  selectedDates: Date[];
  onSelect: SelectMultipleEventHandler;
}

const MultiDatePicker: React.FC<MultiDatePickerProps> = ({
  selectedDates,
  onSelect,
}) => {
  const footer =
    selectedDates?.length > 0 ? (
      <p className="mt-4 text-sm text-gray-500">
        You selected {selectedDates.length}{" "}
        {selectedDates.length === 1 ? "date" : "dates"}.
      </p>
    ) : (
      <p className="mt-4 text-sm text-gray-500">
        Please pick one or more dates.
      </p>
    );

  return (
    <div className="rounded-2xl border border-gray-200 p-4 shadow-sm">
      <DayPicker
        mode="multiple"
        selected={selectedDates}
        onSelect={onSelect}
        classNames={classNames}
        footer={footer}
        // formatters={{
        //   formatCaption: (date) => (
        //     <span className="text-purple-900">{format(date, "MMM yyyy")}</span>
        //   ),
        // }}
        formatters={{
          formatCaption: (date: Date) => format(date, "MMM yyyy"),
        }}
      />
    </div>
  );
};

export default MultiDatePicker;
