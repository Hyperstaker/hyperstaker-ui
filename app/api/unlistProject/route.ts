import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { hypercertId } = await request.json();

  try {
    const updatedProject = await prisma.projectListings.updateMany({
      where: { hypercertId },
      data: { listed: false },
    });

    return NextResponse.json({ updatedProject });
  } catch (error) {
    console.error("Error unlisting project:", error);
    return NextResponse.json(
      { error: "Failed to unlist project" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
