-- CreateTable
CREATE TABLE "EnvVar" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "encryptedValue" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "EnvVar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EnvVar_project_id_idx" ON "EnvVar"("project_id");

-- AddForeignKey
ALTER TABLE "EnvVar" ADD CONSTRAINT "EnvVar_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
