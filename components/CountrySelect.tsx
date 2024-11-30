import { useState, useMemo, useEffect } from "react";

import countryList from "react-select-country-list";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface CountrySelectProps {
  value: { value: string; label: string } | null;
  onChange: (value: { value: string; label: string } | null) => void;
  error?: string;
  className?: string;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange,
  error,
}) => {
  const options = useMemo(() => countryList().getData(), []);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (selectedValue: string) => {
    const selectedOption =
      options.find((option) => option.value === selectedValue) || null;
    onChange(selectedOption);
  };

  return (
    <div className="space-y-2">
      <Select onValueChange={handleChange} value={value?.value || ""}>
        <SelectTrigger
          className={cn("w-full py-6 bg-[#F7F0FA]", error && "border-red-500")}
        >
          <SelectValue placeholder="Select a country" />
        </SelectTrigger>
        <SelectContent className="space-y-2">
          <div className="px-2">
            <Input
              placeholder="Search country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-2"
            />
          </div>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))
          ) : (
            <p className="px-2 py-1 text-sm text-gray-500">No results found</p>
          )}
        </SelectContent>
      </Select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
