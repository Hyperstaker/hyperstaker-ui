import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const projectListing = await prisma.projectListings.findMany({
      where: { listed: true },
    });

    return NextResponse.json({ data: projectListing });
  } catch (error) {
    console.error("Error fetching project listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch project listings" },
      { status: 500 }
    );
  }
}
