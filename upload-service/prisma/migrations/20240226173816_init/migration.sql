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

-- AddForeignKey
ALTER TABLE "LogEvent" ADD CONSTRAINT "LogEvent_deployment_id_fkey" FOREIGN KEY ("deployment_id") REFERENCES "Deployment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
