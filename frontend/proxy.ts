import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const role = req.cookies.get("role")?.value ?? "guest";

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-role", role);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api/proxy).*)"],
};
