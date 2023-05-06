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

  // TODO: 093
  res.status(200).json({
    slug,
    day,
    time,
    partySize,
  });
};
