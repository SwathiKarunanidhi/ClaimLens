import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Injectable,
  Module,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from "@nestjs/common";
import {
  AssessmentEngine,
  assessmentInput,
  PROMPT_VERSION,
} from "./assessment";
import { Database } from "./database";

export function serializeAssessment<T extends { evidenceGaps: string }>(
  value: T,
) {
  return { ...value, evidenceGaps: JSON.parse(value.evidenceGaps) as string[] };
}

@Injectable()
export class ClaimsService {
  constructor(
    @Inject(Database) private readonly db: Database,
    @Inject(AssessmentEngine) private readonly engine: AssessmentEngine,
  ) {}

  async list() {
    const claims = await this.db.claim.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        assessments: {
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          take: 1,
        },
        _count: { select: { assessments: true } },
      },
    });
    return claims.map(({ assessments, _count, ...claim }) => ({
      ...claim,
      latestAssessment: assessments[0]
        ? serializeAssessment(assessments[0])
        : null,
      assessmentCount: _count.assessments,
    }));
  }

  async detail(id: number) {
    const claim = await this.db.claim.findUnique({
      where: { id },
      include: {
        assessments: { orderBy: [{ createdAt: "desc" }, { id: "desc" }] },
      },
    });
    if (!claim) throw new NotFoundException("Claim not found.");
    return {
      ...claim,
      assessments: claim.assessments.map(serializeAssessment),
    };
  }

  async assess(body: unknown) {
    const parsed = assessmentInput.safeParse(body);
    if (!parsed.success)
      throw new BadRequestException(
        parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
      );
    const { claimId, claim: text, evidence } = parsed.data;
    const claim = await this.db.claim.findUnique({ where: { id: claimId } });
    if (!claim) throw new NotFoundException("Claim not found.");
    if (text !== claim.claimText)
      throw new BadRequestException(
        "Claim wording differs from the saved claim. Reload the page and retry.",
      );
    const result = await this.engine.assess(
      claimId,
      text,
      evidence,
      claim.formulaDescription,
    );
    const saved = await this.db.assessment.create({
      data: {
        claimId,
        claimTextSnapshot: text,
        evidenceText: evidence,
        ...result,
        evidenceGaps: JSON.stringify(result.evidenceGaps),
        model: this.engine.model,
        promptVersion: PROMPT_VERSION,
        mode: this.engine.mode,
      },
    });
    return serializeAssessment(saved);
  }
}

@Controller("api")
export class ClaimsController {
  constructor(
    @Inject(ClaimsService) private readonly claims: ClaimsService,
    @Inject(AssessmentEngine) private readonly engine: AssessmentEngine,
  ) {}
  @Get("health") health() {
    return {
      status: "ok",
      mode: this.engine.mode,
      model: this.engine.model,
      storage: "sqlite-memory",
      seededClaims: 5,
    };
  }
  @Get("claims") list() {
    return this.claims.list();
  }
  @Get("claims/:id") detail(@Param("id", ParseIntPipe) id: number) {
    return this.claims.detail(id);
  }
  @Post("claims/assess") @HttpCode(201) assess(@Body() body: unknown) {
    return this.claims.assess(body);
  }
}

@Module({
  controllers: [ClaimsController],
  providers: [Database, AssessmentEngine, ClaimsService],
})
export class AppModule {}
