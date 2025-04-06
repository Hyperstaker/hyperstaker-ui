import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const revalidate = 1;

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { hypercertId } = await request.json();

  try {
    const projectListing = await prisma.projectListings.findFirst({
      where: { hypercertId },
    });

    return NextResponse.json({ listed: projectListing?.listed || false });
  } catch (error) {
    console.error("Error checking project listing:", error);
    return NextResponse.json(
      { error: "Failed to check project listing" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
