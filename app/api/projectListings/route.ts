import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ProjectListings } from "@prisma/client";
export const revalidate = 1;

const prisma = new PrismaClient();

export async function GET() {
  try {
    const projectListing = await prisma.projectListings.findMany({
      where: { listed: true },
    });

    const filteredProjectListing: ProjectListings[] = [];

    await Promise.all(
      projectListing.map(async (listing) => {
        const project = await prisma.alloProfiles.findFirst({
          where: { hypercertId: listing.hypercertId },
        });

        if (project?.deleted === false) {
          filteredProjectListing.push(listing);
        }
      })
    );

    return NextResponse.json({ data: filteredProjectListing });
  } catch (error) {
    console.error("Error fetching project listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch project listings" },
      { status: 500 }
    );
  }
}
