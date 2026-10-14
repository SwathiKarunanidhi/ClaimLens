# ClaimLens current implementation


The executable implementation accompanies this proposal. The following excerpts summarize the three technical areas requested in the assignment; they are illustrative outlines, not replacements for the application source.

### Database relationship

```prisma
model Claim {
  id                 String       @id @default(cuid())
  productName        String
  category           String
  claimText          String
  formulaDescription String
  evidence           String
  createdAt          DateTime     @default(now())
  updatedAt          DateTime     @updatedAt
  assessments        Assessment[]
}

model Assessment {
  id                String   @id @default(cuid())
  claimId           String
  claim             Claim    @relation(fields: [claimId], references: [id])
  claimTextSnapshot String
  evidenceText      String
  justified         Boolean
  confidenceScore   Int
  reasoning         String
  evidenceGaps      String
  model             String
  promptVersion     String
  mode              String
  createdAt         DateTime @default(now())

  @@index([claimId, createdAt])
}
```

The executable schema additionally specifies the SQLite datasource, Prisma generator, and relation deletion behavior. The prototype writes `evidenceGaps` as JSON text and exposes an array to clients.

### NestJS assessment workflow

```typescript
@Controller("api/claims")
class ClaimsController {
  @Post("assess")
  @HttpCode(201)
  assess(@Body() body: unknown) {
    return this.claimsService.assess(body);
  }
}

// Service outline
validateRequest(body);
const claim = await loadClaimAndCheckWording(body);
const result = await assessmentEngine.assess(
  claim.id, claim.claimText, body.evidence, claim.formulaDescription
);
validateModelResult(result);
return saveAssessmentWithInputSnapshotsAndExecutionMetadata(result);
```

The live OpenAI engine uses `client.chat.completions.parse` with system/user messages and a schema-backed response format. It handles refusals or invalid results before persistence. The executable controller groups the routes under `api`; the external endpoint remains `POST /api/claims/assess`.

### React request and display

```jsx
async function handleAssessment() {
  try {
    setBusy(true);
    setError("");
    const saved = await api.assess(claim.id, claim.claimText, evidence);
    setResult(saved);
  } catch (error) {
    setError(error.message);
  } finally {
    setBusy(false);
  }
}

// Result display outline
{result && (
  <section>
    <p>Justified: {result.justified ? "Yes" : "No"}</p>
    <p>Confidence: {result.confidenceScore}%</p>
    <p>{result.reasoning}</p>
  </section>
)}
```

The application uses typed React components and additionally displays mode information, evidence gaps, saved history, loading/error states, and the confidence explanation.
