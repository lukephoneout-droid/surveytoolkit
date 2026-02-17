/*
  Warnings:

  - You are about to drop the column `clientName` on the `Job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "clientName",
ADD COLUMN     "geocodeSource" TEXT,
ADD COLUMN     "geocodedAt" TIMESTAMP(3),
ADD COLUMN     "lat" DOUBLE PRECISION,
ADD COLUMN     "lon" DOUBLE PRECISION,
ADD COLUMN     "postcodeNormalised" TEXT;

-- CreateTable
CREATE TABLE "JobFinding" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "sourceSlug" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "structuredJson" JSONB,
    "error" TEXT,
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobFinding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobFinding_jobId_sourceSlug_key" ON "JobFinding"("jobId", "sourceSlug");

-- AddForeignKey
ALTER TABLE "JobFinding" ADD CONSTRAINT "JobFinding_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
