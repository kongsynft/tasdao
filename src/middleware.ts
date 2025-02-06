import { ipAddress } from "@vercel/functions";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { NextRequest, NextResponse } from "next/server";

const redis = Redis.fromEnv();
const ipRatelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(30, "1 h"), // Limit 30 requests per hour per IP
});

const routeRatelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(500, "1 h"), // Limit 500 requests per hour globally
});

export const config = {
  matcher: "/api/langgraph-proxy/:path*",
};

export default async function middleware(request: NextRequest) {
  const ip = ipAddress(request) ?? "127.0.0.1";

  const routeLimit = await routeRatelimit.limit("global");
  if (!routeLimit.success) {
    return createRateLimitResponse(
      "Route limit exceeded.",
      routeLimit.limit,
      routeLimit.remaining,
      routeLimit.reset
    );
  }

  const ipLimit = await ipRatelimit.limit(ip);
  if (!ipLimit.success) {
    return createRateLimitResponse(
      "IP limit exceeded.",
      ipLimit.limit,
      ipLimit.remaining,
      ipLimit.reset
    );
  }

  console.log(
    `IP Limit: ${ipLimit.limit}, Remaining: ${ipLimit.remaining}, Reset Time: ${ipLimit.reset}`
  );
  return NextResponse.next();
}

function createRateLimitResponse(
  message: string,
  limit: number,
  remaining: number,
  resetTimestamp: number
): NextResponse {
  return new NextResponse(
    JSON.stringify({
      success: false,
      message,
      limit,
      remaining,
      reset: resetTimestamp,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": resetTimestamp.toString(),
      },
    }
  );
}
