-- CreateTable
CREATE TABLE "UserAlloProfiles" (
    "id" SERIAL NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "alloProfileId" TEXT NOT NULL,

    CONSTRAINT "UserAlloProfiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserAlloProfiles_walletAddress_idx" ON "UserAlloProfiles"("walletAddress");
