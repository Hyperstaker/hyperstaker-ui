-- CreateTable
CREATE TABLE "ProjectCreationProgress" (
    "id" SERIAL NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "organisationName" TEXT NOT NULL,
    "currentStep" INTEGER NOT NULL,
    "alloProfileId" TEXT,
    "hypercertId" TEXT,
    "alloPoolId" INTEGER,
    "hyperfundPoolId" INTEGER,
    "hyperstakerId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "formData" JSONB NOT NULL,
    CONSTRAINT "ProjectCreationProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectCreationProgress_walletAddress_idx" ON "ProjectCreationProgress" ("walletAddress");

-- CreateIndex
CREATE INDEX "ProjectCreationProgress_status_idx" ON "ProjectCreationProgress" ("status");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectCreationProgress_walletAddress_projectName_key" ON "ProjectCreationProgress" (
    "walletAddress",
    "projectName"
);