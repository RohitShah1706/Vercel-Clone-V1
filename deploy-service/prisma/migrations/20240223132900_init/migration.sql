-- CreateEnum
CREATE TYPE "DeploymentStatus" AS ENUM ('QUEUED', 'DEPLOYING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "Deployment" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "branch" TEXT NOT NULL DEFAULT 'main',
    "commit_id" TEXT NOT NULL DEFAULT 'HEAD',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "DeploymentStatus" NOT NULL DEFAULT 'QUEUED',

    CONSTRAINT "Deployment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnvVar" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "encryptedValue" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "EnvVar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "build_cmd" TEXT NOT NULL DEFAULT 'npm run build',
    "install_cmd" TEXT NOT NULL DEFAULT 'npm install',
    "out_dir" TEXT NOT NULL DEFAULT 'dist',
    "root_dir" TEXT NOT NULL DEFAULT '',
    "github_project_name" TEXT NOT NULL,
    "user_email_id" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EnvVar_project_id_idx" ON "EnvVar"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Deployment" ADD CONSTRAINT "Deployment_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnvVar" ADD CONSTRAINT "EnvVar_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_user_email_id_fkey" FOREIGN KEY ("user_email_id") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
