-- CreateTable
CREATE TABLE "ProjectListings" (
    "id" SERIAL NOT NULL,
    "hypercertId" TEXT NOT NULL,
    "listed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProjectListings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlloProfiles" (
    "id" SERIAL NOT NULL,
    "hypercertId" TEXT NOT NULL,
    "alloProfile" TEXT NOT NULL,

    CONSTRAINT "AlloProfiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectListings_hypercertId_idx" ON "ProjectListings"("hypercertId");

-- CreateIndex
CREATE INDEX "AlloProfiles_hypercertId_idx" ON "AlloProfiles"("hypercertId");
