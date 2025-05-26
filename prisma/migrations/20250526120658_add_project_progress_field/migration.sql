/*
  Warnings:

  - Added the required column `projectCreationProgress` to the `ProjectCreationProgress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProjectCreationProgress" ADD COLUMN     "projectCreationProgress" TEXT NOT NULL;
