import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { TrineResult } from "@/lib/compute";

// GET /api/readings — return all saved readings for the current user
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const readings = await prisma.reading.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      archetype: true,
      mbtiType: true,
      sunSign: true,
      lifePath: true,
      result: true,
    },
  });

  return NextResponse.json(readings);
}

// POST /api/readings — save a new reading for the current user
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const result: TrineResult = body.result;

  if (!result?.mbti?.type || !result?.astrology?.sunSign || result?.numerology?.lifePath == null) {
    return NextResponse.json({ error: "Invalid result payload" }, { status: 400 });
  }

  const reading = await prisma.reading.create({
    data: {
      userId,
      archetype: result.archetype,
      mbtiType: result.mbti.type,
      sunSign: result.astrology.sunSign,
      lifePath: result.numerology.lifePath,
      result: result as object,
    },
  });

  return NextResponse.json(reading, { status: 201 });
}
