/*
  Warnings:

  - A unique constraint covering the columns `[key,project_id]` on the table `EnvVar` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EnvVar_key_project_id_key" ON "EnvVar"("key", "project_id");
