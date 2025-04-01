// hyperstaker-ui/app/api/addEntry/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { hypercertId, alloProfile, alloPool, listed } = await request.json();

  try {
    // Create a new AlloProfile entry
    const alloProfileEntry = await prisma.alloProfiles.create({
      data: {
        hypercertId,
        alloProfile,
        alloPool: parseInt(alloPool),
      },
    });

    // Create a new ProjectListing entry
    const projectListingEntry = await prisma.projectListings.create({
      data: {
        hypercertId,
        listed,
      },
    });

    return NextResponse.json({ alloProfileEntry, projectListingEntry });
  } catch (error) {
    console.error("Error adding entry:", error);
    return NextResponse.json({ error: "Failed to add entry" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
