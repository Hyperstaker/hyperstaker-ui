import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const revalidate = 1;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get("walletAddress");

  const progress = await prisma.projectCreationProgress.findMany({
    where: {
      walletAddress: walletAddress as `0x${string}`,
    },
  });

  return NextResponse.json(progress);
}

export async function POST(request: Request) {
  const { walletAddress, projectName } = await request.json();

  const progress = await prisma.projectCreationProgress.findUnique({
    where: {
      walletAddress_projectName: { walletAddress, projectName },
    },
  });

  return NextResponse.json(progress);
}
