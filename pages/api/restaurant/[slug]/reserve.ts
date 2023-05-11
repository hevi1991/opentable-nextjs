import { findAvailableTables } from "@@/services/restaurant/findAvailableTables";
import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";

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

  try {
    const availabilityTables = await findAvailableTables({
      slug,
      day,
      time,
      partySize,
    });
    const availabilityTable = availabilityTables.find((t) => t.time === time);
    if (!availabilityTable) {
      return res
        .status(400)
        .json({ errorMessage: "No availability, cannot book" });
    }

    const sumSeats = availabilityTable.tables.reduce(
      (sum, t) => sum + t.seats,
      0
    );
    if (sumSeats < parseInt(partySize)) {
      return res
        .status(400)
        .json({ errorMessage: "No availability, cannot book" });
    }

    return res.status(200).json({ availabilityTable });
  } catch (error) {
    res.status(400).json({ errorMessage: (error as Error).message });
  }
};

// http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/reserve?day=2023-05-11&time=14:00:00.000Z&partySize=8
