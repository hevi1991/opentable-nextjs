"use client";
import { DatePicker } from "@@/app/components/DatePicker";
import LoadingIcon from "@@/app/components/icons/LoadingIcon";
import { partySize as partySizes, times } from "@@/data";
import useAvailabilities from "@@/hooks/useAvailabilities";
import { convertToDisplayTime } from "@@/utils/convertToDisplayTime";
import { isWithinInterval, parse, parseISO } from "date-fns";
import Link from "next/link";
import { useState } from "react";

export default function ReservationCard({
  openTime,
  closeTime,
  slug,
}: {
  openTime: string;
  closeTime: string;
  slug: string;
}) {
  // filter times with open window time
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

  const [time, setTime] = useState(openTime);

  const [partySize, setPartySize] = useState("2");

  const [day, setDay] = useState(new Date().toISOString().split("T")[0]);

  // fetch available tables
  const { data, loading, error, fetchAvailabilites } = useAvailabilities();
  const handleClick = async () => {
    await fetchAvailabilites({
      slug,
      day,
      time: time,
      partySize,
    });
  };

  // TODO: rendering avail.... time options

  return (
    <div className="fixed w-[15%] bg-white rounded p-3 shadow">
      <div className="text-center border-b pb-2 font-bold">
        <h4 className="mr-7 text-lg">Make a Reservation</h4>
      </div>
      <div className="my-3 flex flex-col">
        <label htmlFor="">Party size</label>
        <select
          className="py-3 border-b font-light"
          value={partySize}
          onChange={(e) => setPartySize(e.target.value)}
        >
          {partySizes.map(({ value, label }) => (
            <option value={value} key={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Date</label>
          <DatePicker day={day} setDay={setDay}></DatePicker>
        </div>
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Time</label>
          <select
            className="py-3 border-b font-light"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
            }}
          >
            {timesWithinOpenWindow.map((time) => (
              <option value={time.time} key={time.time}>
                {time.displayTime}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-5">
        <button
          className="bg-red-600 rounded w-full px-4 text-white font-bold h-16 text-center"
          onClick={handleClick}
          disabled={loading}
        >
          {loading ? <LoadingIcon /> : "Find a Time"}
        </button>
      </div>
      {data && data.length ? (
        <div className="mt-4">
          <p className="text-reg">Select a Time</p>
          <div className="flex flex-wrap mt-2">
            {data.map((time) => {
              return time.available ? (
                <Link
                  href={`/reserve/${slug}?date=${day}T${time.time}&partySize=${partySize}`}
                  className=" bg-red-600 cursor-pointer p-2 w-24 text-center text-white mb-3 rounded mr-3"
                >
                  <p className="text-sm font-bold">
                    {convertToDisplayTime(time.time)}
                  </p>
                </Link>
              ) : (
                <p className="bg-gray-300 p-2 w-24 mb-3 rounded mr-3 text-center text-sm font-bold">
                  {convertToDisplayTime(time.time)}
                </p>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
