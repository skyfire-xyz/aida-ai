// middleware.ts
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

// RegExp for public files
const PUBLIC_FILE = /\.(.*)$/; // Files

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Skip public files
  if (PUBLIC_FILE.test(url.pathname) || url.pathname.includes("_next")) return;

  if (url.pathname === "/" || url.pathname === "/admin") {
    if (process.env["AIDA_AI_AUTH"]) {
      if (!isAuthenticated(req, "AIDA_AI_AUTH")) {
        return new NextResponse("Authentication required", {
          status: 401,
          headers: { "WWW-Authenticate": "Basic" },
        });
      }
    }
  }

  return NextResponse.rewrite(url);
}

function isAuthenticated(req: NextRequest, envName: string) {
  const [AUTH_USER, AUTH_PASS] = (process.env[envName] || ":").split(":");

  const authheader =
    req.headers.get("authorization") || req.headers.get("Authorization");

  if (!authheader) {
    return false;
  }

  const auth = Buffer.from(authheader.split(" ")[1], "base64")
    .toString()
    .split(":");
  const user = auth[0];
  const pass = auth[1];

  if (AUTH_PASS && AUTH_USER && user == AUTH_USER && pass == AUTH_PASS) {
    return true;
  } else {
    return false;
  }
}
