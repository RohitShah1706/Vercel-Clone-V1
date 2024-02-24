/*
  Warnings:

  - A unique constraint covering the columns `[last_deployment_id]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "last_deployment_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Project_last_deployment_id_key" ON "Project"("last_deployment_id");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_last_deployment_id_fkey" FOREIGN KEY ("last_deployment_id") REFERENCES "Deployment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
