import { kv } from "@vercel/kv";
import { Ratelimit } from "@upstash/ratelimit";
import { NextRequest, NextResponse } from "next/server";

const ipRatelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(20, "1 h"),
});

const routeRatelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(400, "1 h"),
});

export const config = {
  matcher: ["/api/gpt-3-turbo/message"],
};

export default async function middleware(request: NextRequest) {
  const ip = request.ip ?? "127.0.0.1";

  const routeLimit = await routeRatelimit.limit("global");
  if (!routeLimit.success) {
    return createRateLimitResponse(routeLimit.reset);
  }

  const ipLimit = await ipRatelimit.limit(ip);
  if (!ipLimit.success) {
    return createRateLimitResponse(ipLimit.reset);
  }

  return NextResponse.next();
}

function createRateLimitResponse(resetTimestamp: number): NextResponse {
  const retryAfterSeconds = Math.max(0, resetTimestamp - Date.now()) / 1000;
  return new NextResponse("Rate limit exceeded. Please try again later.", {
    status: 429,
    headers: {
      "Retry-After": retryAfterSeconds.toString(),
      "Content-Type": "text/plain",
    },
  });
}
