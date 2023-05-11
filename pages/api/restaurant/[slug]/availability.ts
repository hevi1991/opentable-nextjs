import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";
import { findAvailableTables } from "@@/services/restaurant/findAvailableTables";

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
    const availablities = await findAvailableTables({
      slug,
      day,
      time,
      partySize,
    });
    const result = availablities.map((t) => {
      const sumSeats = t.tables.reduce((sum, table) => {
        return sum + table.seats;
      }, 0);
      return {
        time: t.time,
        available: sumSeats >= parseInt(partySize),
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ errorMessage: (error as Error).message });
  }
};
