import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const {
    projectName,
    projectCreationProgress,
    walletAddress,
    organisationName,
    status,
    formData,
    hypercertId,
    hyperfundPoolId,
    hyperstakerId,
    alloPoolId,
  } = await request.json();

  try {
    const updatedProgress = await prisma.projectCreationProgress.upsert({
      where: { walletAddress_projectName: { walletAddress, projectName } },
      update: {
        projectCreationProgress,
        status,
        formData,
        hypercertId,
        hyperfundPoolId,
        hyperstakerId,
        alloPoolId,
      },
      create: {
        projectName,
        projectCreationProgress,
        currentStep: 1,
        walletAddress,
        organisationName,
        status,
        formData,
      },
    });

    return NextResponse.json(updatedProgress);
  } catch (error) {
    console.error("Error updating hypercert:", error);
    return NextResponse.json(
      { error: "Failed to update hypercert" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: Request) {
  const { projectName, walletAddress } = await request.json();

  const deletedProgress = await prisma.projectCreationProgress.delete({
    where: { walletAddress_projectName: { walletAddress, projectName } },
  });

  return NextResponse.json(deletedProgress);
}
