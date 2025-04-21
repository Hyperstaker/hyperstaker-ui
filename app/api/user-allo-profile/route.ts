import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const revalidate = 1;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    // Get walletAddress from query parameters
    const walletAddress = url.searchParams.get("walletAddress");
    if (!walletAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get allo profiles of user wallet
    const alloProfiles = await prisma.userAlloProfiles.findMany({
      where: {
        walletAddress,
      },
      select: {
        alloProfileId: true,
      },
    });

    return NextResponse.json(
      alloProfiles.map((i) => i.alloProfileId),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in user-allo-profile GET API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { walletAddress, alloProfileId } = await request.json();

    if (!walletAddress || !alloProfileId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if entry already exists
    const existingProfile = await prisma.userAlloProfiles.findFirst({
      where: {
        walletAddress,
        alloProfileId,
      },
    });

    if (existingProfile) {
      return NextResponse.json(
        { message: "Profile already exists" },
        { status: 200 }
      );
    }

    // Create new entry if it doesn't exist
    const newProfile = await prisma.userAlloProfiles.create({
      data: {
        walletAddress,
        alloProfileId,
      },
    });

    return NextResponse.json(newProfile, { status: 201 });
  } catch (error) {
    console.error("Error in user-allo-profile API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
