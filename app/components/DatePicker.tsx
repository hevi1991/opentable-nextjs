import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { format, parse, parseISO } from "date-fns";

import { Calendar } from "@@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@@/components/ui/popover";

export function DatePicker({
  showFormatString = "MMMM d",
  dayFormatString = "yyyy-MM-dd",
  day,
  setDay,
}: {
  showFormatString?: string;
  dayFormatString?: string;
  day: string;
  setDay: Dispatch<SetStateAction<string>>;
}) {
  const [date, setDate] = useState<Date>();

  const [showText, setShowText] = useState("");

  const disabledDays = [{ before: new Date() }];

  useEffect(() => {
    setDay(date ? format(date, dayFormatString) : "");
    setShowText(date ? format(date, showFormatString) : "");
    setOpen(false);
  }, [date]);

  useEffect(() => {
    const parseDate = parse(day, dayFormatString, new Date());
    setDate(!isNaN(parseDate.getTime()) ? parseDate : undefined);
    setShowText(format(parseISO(`${day}T00:00:00Z`), showFormatString));
  }, []);

  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <input
          type="text"
          readOnly
          value={showText}
          className="py-3 pl-1 border-b font-light"
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={disabledDays}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
