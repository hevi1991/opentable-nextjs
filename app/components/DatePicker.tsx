import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { format, parse } from "date-fns";

import { Calendar } from "@@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@@/components/ui/popover";

export function DatePicker({
  formatString = "MMMM d",
  dateValue,
  setDateValue,
}: {
  formatString?: string;
  dateValue: string;
  setDateValue: Dispatch<SetStateAction<string>>;
}) {
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    setDateValue(date ? format(date, formatString) : "");
  }, [date]);

  useEffect(() => {
    const parseDate = parse(dateValue, formatString, new Date());
    setDate(!isNaN(parseDate.getTime()) ? parseDate : undefined);
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <input
          type="text"
          readOnly
          value={dateValue}
          className="py-3 pl-1 border-b font-light w-28"
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
