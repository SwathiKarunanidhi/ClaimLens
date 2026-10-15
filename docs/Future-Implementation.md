# ClaimLens future implementation

Proposed data model and workflow for extending ClaimLens across the claims lifecycle. These are roadmap designs; the current application implements claim evaluation only.

## Future model

![Proposed entity relationship diagram](../assets/screenshots/future_er.png)

Six core entities and one join table keep product details, tested formulations, claims, evidence, assessments and workflow history separate. AssessmentEvidence supports multiple studies per assessment without copying study records.

Types use Prisma notation: Int, String, Boolean, DateTime and Json. Stage represents restricted workflow values; `?` means optional. PK is a primary key and FK is a foreign key. Integer primary keys auto-increment; AssessmentEvidence uses a composite primary key.

WorkflowEvent.actorSubject records the authenticated identity from the identity system; a separate user table is not included in this initial model. Stage values and relationships do not replace backend permission checks.

### Claim stages

![Proposed claim stages](../assets/screenshots/claim_stages.png)

| Stage | Responsible stakeholder | Decision |
| --- | --- | --- |
| Proposed | Business team | Define the intended product benefit and wording. |
| Screening | Claim manager | Check applicability, feasibility and evidence needs. |
| Testing | Scientist | Test the selected formulation and submit evidence. |
| Evaluation | Evaluator | Review whether evidence supports the exact claim. |
| Approved or Rejected | Authorised reviewer | Record the human decision and rationale. |

## AI vision

Expand ClaimLens from claim evaluation into an AI-assisted workflow covering proposals, screening, scientific testing, and reporting. These are future enhancements; final decisions remain with the responsible business and scientific owners.

| Stage              | Proposed enhancement                                                                                                                   |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| Business proposal  | Suggest measurable claim wording and find similar approved claims.                                                                     |
| Claim screening    | Flag duplicates, feasibility concerns, and missing evidence.                                                                           |
| Scientific testing | Retrieve relevant studies, suggest study-design questions, and extract submitted results. Scientists conduct and validate experiments. |
| Evaluation         | Compare claims against cited evidence and suggest narrower wording when needed.                                                        |
| Reporting          | Draft review reports with sources, findings, and approval history.                                                                     |
