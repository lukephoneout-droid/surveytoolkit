-- CreateEnum
CREATE TYPE "SourceCategory" AS ENUM ('AUTHORITATIVE', 'DATASET', 'LOCAL_GIS', 'COMMERCIAL', 'INDICATIVE', 'REFERENCE');

-- CreateEnum
CREATE TYPE "SourceMode" AS ENUM ('AUTOMATED', 'ASSISTED');

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "SourceCategory" NOT NULL,
    "mode" "SourceMode" NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "enabledFor" "JobType"[] DEFAULT ARRAY['SURVEY', 'VALUATION']::"JobType"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortalConfig" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "authorityName" TEXT NOT NULL,
    "portalType" "SourceCategory" NOT NULL DEFAULT 'LOCAL_GIS',
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isUserConfigurablePortal" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortalConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Source_slug_key" ON "Source"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PortalConfig_orgId_authorityName_portalType_key" ON "PortalConfig"("orgId", "authorityName", "portalType");

-- AddForeignKey
ALTER TABLE "PortalConfig" ADD CONSTRAINT "PortalConfig_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
