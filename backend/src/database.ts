import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSQLite3 } from "@prisma/adapter-better-sqlite3";
import { seedClaims } from "./seed";

@Injectable()
export class Database
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({ adapter: new PrismaBetterSQLite3({ url: ":memory:" }) });
  }

  async onModuleInit() {
    await this.$connect();
    // A fresh schema belongs to the same singleton connection as all Prisma queries.
    // No migration subprocess: another connection would create a different memory DB.
    await this.$executeRawUnsafe(`CREATE TABLE "Claim" (
      "id" TEXT NOT NULL PRIMARY KEY, "productName" TEXT NOT NULL, "category" TEXT NOT NULL,
      "claimText" TEXT NOT NULL, "formulaDescription" TEXT NOT NULL, "sampleEvidence" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL)`);
    await this.$executeRawUnsafe(`CREATE TABLE "Assessment" (
      "id" TEXT NOT NULL PRIMARY KEY, "claimId" TEXT NOT NULL, "claimTextSnapshot" TEXT NOT NULL,
      "evidenceText" TEXT NOT NULL, "justified" BOOLEAN NOT NULL, "confidenceScore" INTEGER NOT NULL,
      "reasoning" TEXT NOT NULL, "evidenceGaps" TEXT NOT NULL, "model" TEXT NOT NULL,
      "promptVersion" TEXT NOT NULL, "mode" TEXT NOT NULL, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE CASCADE ON UPDATE CASCADE,
      CHECK ("confidenceScore" >= 0 AND "confidenceScore" <= 100))`);
    await this.$executeRawUnsafe(
      'CREATE INDEX "Assessment_claimId_createdAt_idx" ON "Assessment"("claimId", "createdAt")',
    );
    await this.claim.createMany({ data: seedClaims });
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
