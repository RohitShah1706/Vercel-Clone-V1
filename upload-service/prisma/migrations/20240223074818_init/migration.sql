/*
  Warnings:

  - You are about to drop the column `github_url` on the `Project` table. All the data in the column will be lost.
  - Added the required column `github_full_name` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "github_url",
ADD COLUMN     "github_full_name" TEXT NOT NULL;
