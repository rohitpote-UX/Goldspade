import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/server";

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);

  if (!session) {
    return NextResponse.json(
      {
        authenticated: false,
        session: null,
      },
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      authenticated: true,
      session: {
        id: session.userId,
        email: session.email,
        name: session.name,
        role: session.role,
      },
    },
    { status: 200 }
  );
}
