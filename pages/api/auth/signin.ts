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
    const { email, password } = req.body;

    const validateSchema = [
      {
        valid: validator.isEmail(email),
        errorMessage: "Email is invalid",
      },
      {
        valid: validator.isLength(password, { min: 1 }),
        errorMessage: "Password is invalid",
      },
    ];
    const errors = validateSchema.reduce<string[]>((errs, c) => {
      if (!c.valid) {
        errs.push(c.errorMessage);
      }
      return errs;
    }, []);
    if (errors.length > 0) {
      return res.status(400).json({ errorMessage: errors.join("; ") });
    }

    // get user in db with form email
    const userWithEmail = await prisma.user.findUnique({ where: { email } });
    if (!userWithEmail) {
      return res
        .status(401)
        .json({ errorMessage: "Email or password is invalid" });
    }

    // compare user's password in db with form's
    // it will take 0 to the last index of $ and plus 22 charactors index as salt, then hash `password` to crypt.
    // For example
    // crypted string: $2b$10$EdOAr5b/yxqedYE/Gez5cuOwI2Xky2EFS0gX4fuuli84Mh4kxxg.G
    // $2b$10$EdOAr5b/yxqedYE/Gez5cu is salt
    // using password and salt hash to get result

    const isMatch = await bcrypt.compare(password, userWithEmail.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ errorMessage: "Email or password is invalid" });
    }

    // make jwt
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new jose.SignJWT({ email: userWithEmail.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(secret);

    return res.status(200).json({ token });
  }
  return res.status(404).send("Unknown endpoint");
}
