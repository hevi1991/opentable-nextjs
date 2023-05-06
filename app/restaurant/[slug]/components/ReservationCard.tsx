"use client";
import { DatePicker } from "@@/app/components/DatePicker";
import { partySize, times } from "@@/data";
import { isWithinInterval, parse } from "date-fns";
import { useState } from "react";

export default function ReservationCard({
  openTime,
  closeTime,
}: {
  openTime: string;
  closeTime: string;
}) {
  const [dateValue, setDateValue] = useState("");

  const formatString = "HH:mm:ss.SSSX";
  const start = parse(openTime, formatString, new Date());
  const end = parse(closeTime, formatString, new Date());
  const timesWithinOpenWindow: typeof times = times.filter((time) => {
    const cur = parse(time.time, formatString, new Date());
    return isWithinInterval(cur, {
      start,
      end,
    });
  });
  
  return (
    <div className="fixed w-[15%] bg-white rounded p-3 shadow">
      <div className="text-center border-b pb-2 font-bold">
        <h4 className="mr-7 text-lg">Make a Reservation</h4>
      </div>
      <div className="my-3 flex flex-col">
        <label htmlFor="">Party size</label>
        <select name="" className="py-3 border-b font-light" id="">
          {partySize.map(({ value, label }) => (
            <option value={value} key={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Date</label>
          <DatePicker
            dateValue={dateValue}
            setDateValue={setDateValue}
          ></DatePicker>
        </div>
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Time</label>
          <select name="" id="" className="py-3 border-b font-light">
            {timesWithinOpenWindow.map((time) => (
              <option value={time.time} key={time.time}>
                {time.displayTime}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-5">
        <button className="bg-red-600 rounded w-full px-4 text-white font-bold h-16">
          Find a Time
        </button>
      </div>
    </div>
  );
}
