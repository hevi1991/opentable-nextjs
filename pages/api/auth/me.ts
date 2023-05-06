import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const email = req.cookies["email"] as string;

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      phone: true,
      city: true,
      email: true,
    },
  });

  if (!user) {
    return res.status(401).json({
      errorMessage: "Unauthorized",
    });
  }

  return res.status(200).json({
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    phone: user.phone,
    city: user.city,
  });
};
