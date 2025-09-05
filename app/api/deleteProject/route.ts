import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { hypercertId } = await request.json();

    if (!hypercertId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update the project's deleted status
    const updatedProject = await prisma.alloProfiles.updateMany({
      where: {
        hypercertId: hypercertId,
      },
      data: {
        deleted: true,
      },
    });

    return NextResponse.json({ success: true, data: updatedProject });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
