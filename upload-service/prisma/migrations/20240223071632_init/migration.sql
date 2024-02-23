/*
  Warnings:

  - Added the required column `github_url` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "build_cmd" TEXT NOT NULL DEFAULT 'npm run build',
ADD COLUMN     "github_url" TEXT NOT NULL,
ADD COLUMN     "install_cmd" TEXT NOT NULL DEFAULT 'npm install',
ADD COLUMN     "out_dir" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "root_dir" TEXT NOT NULL DEFAULT '';
