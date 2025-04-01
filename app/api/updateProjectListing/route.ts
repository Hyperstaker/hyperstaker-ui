import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { hypercertId } = await request.json();

  try {
    // Update the project listing to true
    const updatedProject = await prisma.projectListings.updateMany({
      where: { hypercertId },
      data: { listed: true },
    });

    return NextResponse.json({ updatedProject });
  } catch (error) {
    console.error("Error updating project listing:", error);
    return NextResponse.json(
      { error: "Failed to update project listing" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
