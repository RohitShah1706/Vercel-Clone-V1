/*
  Warnings:

  - You are about to drop the column `user_id` on the `Project` table. All the data in the column will be lost.
  - Added the required column `user_email_id` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_user_id_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "user_id",
ADD COLUMN     "user_email_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_user_email_id_fkey" FOREIGN KEY ("user_email_id") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
