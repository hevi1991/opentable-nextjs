import { PrismaClient } from "@prisma/client";
import { findAvailableTables } from "@@/services/restaurant/findAvailableTables";
import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ errorMessage: "no allowed method" });
  }

  const { slug, day, time, partySize } = req.query as {
    slug: string;
    day: string;
    time: string;
    partySize: string;
  };

  const {
    bookerEmail,
    bookerPhone,
    bookerFirstName,
    bookerLastName,
    bookerOccasion,
    bookerRequest,
  } = req.body;

  for (const value of [
    slug,
    day,
    time,
    partySize,
    bookerEmail,
    bookerPhone,
    bookerFirstName,
    bookerLastName,
  ]) {
    if (value === undefined || validator.isEmpty(value)) {
      return res.status(400).json({ errorMessage: "Invalid data provided" });
    }
  }
  if (parseInt(partySize) < 1) {
    return res.status(400).json({ errorMessage: "Invalid data provided" });
  }

  // logic of booking
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      select: {
        id: true,
        tables: true,
        open_time: true,
        close_time: true,
      },
    });
    if (!restaurant) {
      return res.status(400).json({ errorMessage: "Invalid data provided" });
    }
    const availabilityTablesAllDayInRestaurant = await findAvailableTables({
      restaurant,
      day,
      time,
    });
    const availabilityTableAtTime = availabilityTablesAllDayInRestaurant.find(
      (t) => t.time === time
    );
    if (!availabilityTableAtTime) {
      return res
        .status(400)
        .json({ errorMessage: "No availability, cannot book" });
    }
    const sumSeats = availabilityTableAtTime.tables.reduce(
      (sum, t) => sum + t.seats,
      0
    );

    if (sumSeats < parseInt(partySize)) {
      return res
        .status(400)
        .json({ errorMessage: "No availability, cannot book" });
    }

    // Step3 CounttheTablesBasedonSeats
    const tablesCount: { [seats: number]: number[] } = {};
    availabilityTableAtTime.tables.forEach((t) => {
      if (tablesCount[t.seats] === undefined) {
        tablesCount[t.seats] = [];
      }
      tablesCount[t.seats].push(t.id);
    });

    // Step4 DeterminetheTablestoBook
    const tablesToBooks: number[] = [];
    let seatsRemaining = parseInt(partySize);
    // get keys and order by desc
    const seatTablesDescOrder = Object.keys(tablesCount)
      .sort((a, b) => parseInt(b) - parseInt(a))
      .map((seat) => parseInt(seat));
    // loop from biggest
    while (seatsRemaining > 0) {
      for (let i = 0; i < seatTablesDescOrder.length; i++) {
        const seatTable = seatTablesDescOrder[i];
        if (tablesCount[seatTable].length === 0) {
          continue;
        }
        const nextSeatTable =
          i + 1 < seatTablesDescOrder.length
            ? seatTablesDescOrder[i + 1]
            : null;
        if (
          seatsRemaining > seatTable ||
          (nextSeatTable && seatsRemaining > nextSeatTable)
        ) {
          tablesToBooks.push(tablesCount[seatTable].shift()!);
          seatsRemaining = seatsRemaining - seatTable;
          break;
        } else if (
          seatTablesDescOrder[seatTablesDescOrder.length - 1] === seatTable
        ) {
          // last seat
          tablesToBooks.push(tablesCount[seatTable].shift()!);
          seatsRemaining = seatsRemaining - seatTable;
          break;
        }
      }
    }

    // saving into db
    const booking = await prisma.booking.create({
      data: {
        number_of_people: parseInt(partySize),
        booking_time: new Date(`${day}T${time}`),
        booker_email: bookerEmail,
        booker_phone: bookerPhone,
        booker_first_name: bookerFirstName,
        booker_last_name: bookerLastName,
        booker_occasion: bookerOccasion,
        booker_request: bookerRequest,
        restaurant_id: restaurant.id,
      },
    });
    await prisma.bookingsOnTables.createMany({
      data: tablesToBooks.map((table_id) => ({
        table_id,
        booking_id: booking.id,
      })),
    });

    return res.status(200).json({ booking, tablesToBooks });
  } catch (error) {
    console.error(error);
    res.status(400).json({ errorMessage: (error as Error).message });
  }
};

// http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/reserve?day=2023-05-11&time=14:00:00.000Z&partySize=8
