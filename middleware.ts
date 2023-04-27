import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export const middleware = async (req: NextRequest) => {
  const bearerToken = req.headers.get("authorization");
  if (!bearerToken) {
    return NextResponse.json(
      { errorMessage: "Unauthorized request (no bearer token)" },
      { status: 401 }
    );
  }

  const token = bearerToken.split(" ")[1];
  if (!token) {
    return NextResponse.json(
      { errorMessage: "Unauthorized request (no token)" },
      { status: 401 }
    );
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  try {
    const result = await jwtVerify(token, secret);
    const email = result.payload["email"] as string;
    req.cookies.set("email", email);

    return NextResponse.next({ request: req });
  } catch (error) {
    return NextResponse.json(
      {
        errorMessage: `Unauthorized request. Causes: ${
          (error as Error).message
        }`,
      },
      { status: 401 }
    );
  }
};

export const config = {
  matcher: ["/api/auth/me"],
};
