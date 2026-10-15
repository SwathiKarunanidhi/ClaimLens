# ClaimLens current implementation

The application compares evaluator-submitted evidence with a saved claim. Product testing, formulation development and evidence collection take place outside this prototype.

## Database models

```prisma
model Claim {
  id                 Int       @id @default(autoincrement())
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
  id                Int   @id @default(autoincrement())
  claimId           Int
  claim             Claim    @relation(fields: [claimId], references: [id], onDelete: Cascade)
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

One Claim has many Assessments. Each submission creates a new assessment with the exact wording and evidence used. Integer IDs auto-increment; history resets when the in-memory backend restarts.

## NestJS assessment workflow

![Assessment workflow](../assets/screenshots/assessment_workflow.png)

`ClaimsController.assess` calls `ClaimsService.assess`. The service validates the request, checks the saved claim, calls `AssessmentEngine.assess`, and saves a new record with `db.assessment.create`. It returns the saved assessment to the client.

| Endpoint | Purpose |
| --- | --- |
| GET /api/health | API status, mode and model |
| GET /api/claims | Claims and latest assessments |
| GET /api/claims/:id | Claim details and assessment history |
| POST /api/claims/assess | Assess submitted evidence and save the result |

Valid demo and live results are saved with their mode. Edited demo evidence produces a saved Not assessed result with confidence zero. Failed validation or OpenAI calls do not create a successful assessment. A save failure returns an API error.

## React interaction

Home introduces the tool, Claims lists and filters claims, and Evaluation accepts evidence and displays results. Evidence edits remain in React state until the user submits them. `api.assess` sends claimId, claim wording and evidence; the UI displays verdict, confidence, reasoning, gaps and history.

Demo output is explicitly labelled. Live mode uses OpenAI structured output with Zod validation. Format validation does not establish scientific correctness, and model confidence is not a clinical probability.
