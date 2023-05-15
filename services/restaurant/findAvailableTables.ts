import { times } from "@@/data";
import { PrismaClient, Table } from "@prisma/client";
import { isWithinInterval } from "date-fns";

const prisma = new PrismaClient();

export const findAvailableTables = async ({
  restaurant,
  day,
  time,
}: {
  restaurant: {
    id: number;
    tables: Table[];
    open_time: string;
    close_time: string;
  };
  day: string;
  time: string;
}): Promise<
  {
    date: Date;
    time: string;
    tables: Table[];
  }[]
> => {
  // Step 1 DeterminingtheSearchTimes
  const searchTimes = times.find((t) => t.time === time)?.searchTimes;
  if (!searchTimes) {
    throw new Error("Invalid data provided");
  }

  // Step 2 FetchingtheBookings
  const bookings = await prisma.booking.findMany({
    where: {
      booking_time: {
        gte: new Date(`${day}T${searchTimes[0]}`),
        lte: new Date(`${day}T${searchTimes[searchTimes.length - 1]}`),
      },
      restaurant_id: restaurant.id,
    },
    select: {
      number_of_people: true,
      booking_time: true,
      tables: true,
    },
  });
  // Step 3 CompressingtheBooking
  const bookingTablesObj: {
    [bookingDate: string]: { [tableId: string]: true };
  } = {};
  bookings.forEach((booking) => {
    if (!bookingTablesObj[booking.booking_time.toISOString()]) {
      bookingTablesObj[booking.booking_time.toISOString()] = {};
    }
    bookingTablesObj[booking.booking_time.toISOString()] = Object.assign(
      bookingTablesObj[booking.booking_time.toISOString()],
      booking.tables.reduce((obj, table) => {
        return { ...obj, [table.table_id]: true };
      }, {})
    );
  });

  // Step 4 FetchingtheRestaurantTables
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
  const availablities = searchTimesWithTables.filter((ava) => {
    return isWithinInterval(new Date(`${day}T${ava.time}`), {
      start: new Date(`${day}T${restaurant.open_time}`),
      end: new Date(`${day}T${restaurant.close_time}`),
    });
  });

  return availablities;
};
