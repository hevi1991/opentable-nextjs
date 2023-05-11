import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";
import { times } from "@@/data/index";
import { isWithinInterval } from "date-fns";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug, day, time, partySize } = req.query as {
    slug: string;
    day: string;
    time: string;
    partySize: string;
  };

  for (const value of [slug, day, time, partySize]) {
    if (value === undefined || validator.isEmpty(value)) {
      return res.status(400).json({ errorMessage: "Invalid data provided" });
    }
  }

  // Step 1 DeterminingtheSearchTimes
  const searchTimes = times.find((t) => t.time === time)?.searchTimes;
  if (!searchTimes) {
    return res.status(400).json({ errorMessage: "Invalid data provided" });
  }

  // Step 2 FetchingtheBookings
  const bookings = await prisma.booking.findMany({
    where: {
      booking_time: {
        gte: new Date(`${day}T${searchTimes[0]}`),
        lte: new Date(`${day}T${searchTimes[searchTimes.length - 1]}`),
      },
    },
    select: {
      number_of_people: true,
      booking_time: true,
      tables: true,
    },
  });
  // Step 3 CompressingtheBooking
  const bookingTablesObj: { [key: string]: { [key: string]: true } } = {};
  bookings.forEach((booking) => {
    bookingTablesObj[booking.booking_time.toISOString()] =
      booking.tables.reduce((obj, table) => {
        return { ...obj, [table.table_id]: true };
      }, {});
  });

  // Step 4 FetchingtheRestaurantTables
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    select: {
      tables: true,
      open_time: true,
      close_time: true,
    },
  });
  if (!restaurant) {
    return res.status(400).json({ errorMessage: "Invalid data provided" });
  }
  const { tables } = restaurant;

  // Step 5 ReformattingtheSearchTimes
  const searchTimesWithTables = searchTimes.map((searchTime) => {
    return {
      date: new Date(`${day}T${searchTime}`),
      time: searchTime,
      tables,
    };
  });

  // Step 6 FilteringOuttheBookedTables
  searchTimesWithTables.forEach((t) => {
    t.tables = t.tables.filter((table) => {
      if (bookingTablesObj[t.date.toISOString()]) {
        if (bookingTablesObj[t.date.toISOString()][table.id]) {
          return false;
        }
      }
      return true;
    });
  });

  // Step 7 DeterminingtheAvailability
  const availablities = searchTimesWithTables
    .map((t) => {
      const sumSeats = t.tables.reduce((sum, table) => {
        return sum + table.seats;
      }, 0);
      return {
        time: t.time,
        available: sumSeats >= parseInt(partySize),
      };
    })
    .filter((ava) => {
      return isWithinInterval(new Date(`${day}T${ava.time}`), {
        start: new Date(`${day}T${restaurant.open_time}`),
        end: new Date(`${day}T${restaurant.close_time}`),
      });
    });

  res.status(200).json(availablities);
};

// http://localhost:3000/restaurant/vivaan-fine-indian-cuisine-ottawa/availability?day=2023-05-09&time=14:00:00.000Z&partySize=4
