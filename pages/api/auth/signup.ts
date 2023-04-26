import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";
import bcrypt from "bcrypt";
import * as jose from "jose";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { firstName, lastName, email, phone, city, password } = req.body;

    const validationSchema = [
      {
        valid: validator.isLength(firstName, {
          min: 1,
          max: 20,
        }),
        errorMessage: "FirstName is invalid",
      },
      {
        valid: validator.isLength(lastName, {
          min: 1,
          max: 20,
        }),
        errorMessage: "LastName is invalid",
      },
      {
        valid: validator.isEmail(email),
        errorMessage: "Email is invalid",
      },
      {
        valid: validator.isMobilePhone(phone),
        errorMessage: "Phone is invalid",
      },
      {
        valid: validator.isLength(city, {
          min: 2,
        }),
        errorMessage: "City is invalid",
      },
      {
        valid: validator.isStrongPassword(password, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 0,
        }),
        errorMessage:
          "Password is invalid, Currect format: minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1,",
      },
    ];

    // validate form
    const errors = validationSchema.reduce<string[]>((errs, c) => {
      if (!c.valid) {
        errs.push(c.errorMessage);
      }
      return errs;
    }, []);

    if (errors.length > 0) {
      return res.status(400).json({ errorMessage: errors.join("; ") });
    }

    // validate email whether existed
    const userWithEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (userWithEmail) {
      return res
        .status(400)
        .json({ errorMessage: "Email is associated with anther account" });
    }

    // hash password and save into db
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        city,
        email,
        password: hashedPassword,
        phone,
      },
    });

    // make jwt
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new jose.SignJWT({ email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(secret);

    return res.status(200).json({ token });
  }

  return res.status(404).send("Unknown endpoint");
}
