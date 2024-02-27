/*
  Warnings:

  - A unique constraint covering the columns `[last_deployment_id]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Deployment" ALTER COLUMN "commit_id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "last_deployment_id" TEXT;

-- CreateTable
CREATE TABLE "LogEvent" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deployment_id" TEXT,
    "log" TEXT NOT NULL,

    CONSTRAINT "LogEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LogEvent_deployment_id_idx" ON "LogEvent"("deployment_id");

-- CreateIndex
CREATE UNIQUE INDEX "Project_last_deployment_id_key" ON "Project"("last_deployment_id");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_last_deployment_id_fkey" FOREIGN KEY ("last_deployment_id") REFERENCES "Deployment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogEvent" ADD CONSTRAINT "LogEvent_deployment_id_fkey" FOREIGN KEY ("deployment_id") REFERENCES "Deployment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
