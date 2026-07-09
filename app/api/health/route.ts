import { NextResponse } from "next/server";

import { getRedisStatus } from "@/lib/redis/client";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "foliofox",
    redis: getRedisStatus(),
    timestamp: new Date().toISOString(),
  });
}
