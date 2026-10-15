# ClaimLens assessment submission

## Overview

ClaimLens helps compare evidence submitted by evaluators with the exact wording of proposed product claims. The prototype provides a three-page React interface, a NestJS API, an OpenAI integration and Prisma with in-memory SQLite. It saves each assessment for review, including the submitted wording, evidence and result.

The database runs in memory to simplify setup; data resets when the backend restarts. The application supports evidence assessment, not the complete product-development and testing workflow.

## 1. Business process understanding

Business team proposes a product and its intended claims.
Claim managers and research stakeholders check applicability, feasibility and relevant existing work.
Scientists develop and test the formulation.
Evaluators test the product against the claims and submit evidence and reports.

| Stage | Responsible stakeholder | Output |
| --- | --- | --- |
| Product proposal | Business or marketing team | Product idea and proposed claims |
| Feasibility screening | Claim manager and research team | Applicability, feasibility and relevant existing knowledge |
| Formulation development | Scientist | Developed formulation and formulation-test findings |
| Product evaluation | Evaluator | Evidence and report from testing the product against its claims |

One product may have several claims requiring different evidence. A study showing improved hydration at 24 hours does not establish 48-hour hydration. ClaimLens identifies that gap in the supplied evidence; insufficient support does not prove the claim false.

The prototype begins when evaluation evidence is available. It compares that evidence with a selected claim and returns a recommendation for human review. It does not conduct product tests, collect raw observations or approve claims automatically.

## 2. Research performed designing the solution

### Industry and business research

- L’Oréal distinguishes formulation development from evaluation, which includes clinical studies, consumer testing and instrumental measurements. [L’Oréal R&I](https://careers.loreal.com/en/research-innovation-careers)
- L’Oréal combines scientific knowledge with consumer insights and evaluates product efficacy, sensory experience and real-life use. [Beauty Full of Science](https://www.loreal.com/en/commitments-and-responsibilities/for-our-products/beauty-full-of-science/)

### Technical research

| Research area | Design decision |
| --- | --- |
| React components and state | Separate Home, Claims and Evaluation views; show loading, errors and results clearly. |
| NestJS controllers and services | Separate HTTP routing, business checks and model interaction. |
| Prisma and SQLite adapters | Use a singleton in-memory database for simple local setup and assessment history. |
| Structured model output | Define predictable result fields and validate them before saving. |
| Claim and evidence comparison | Compare outcome, magnitude, duration, population and formulation context; explain missing evidence. |

Sources: [React](https://react.dev/learn/thinking-in-react), [NestJS](https://docs.nestjs.com/controllers), [Prisma SQLite](https://docs.prisma.io/docs/orm/v6/overview/databases/sqlite), [SQLite adapter](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md), [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=chat).

## 3. Technical architecture justification

![Current ClaimLens architecture](../assets/screenshots/current_architecture.png)

React presents the claim library and evidence-assessment interface. NestJS validates the request, loads the saved claim, obtains an assessment and saves the result through Prisma. The assessment engine isolates the prompt and OpenAI interaction from the controller and persistence logic.

| Choice | Why it fits the prototype |
| --- | --- |
| React | Reusable components and state for an interactive assessment flow. |
| NestJS services | Clear responsibilities and dependencies that can be replaced in tests. |
| Prisma and in-memory SQLite | Typed relational queries without database-server setup. |
| Direct model request | Keeps the required end-to-end flow simple. |
| Input snapshots | Preserve the wording and evidence evaluated on each run. |

The assessment endpoint receives `claimId`, `claim` and `evidence`. Zod checks types and limits; the service checks that the claim exists and submitted wording matches the saved wording. These are separate checks: a valid input shape does not establish a valid business record.

The result contains justified or not justified, a confidence score, reasoning and evidence gaps. Valid positive and negative recommendations create new Assessment records. Invalid requests and failed model calls do not create successful assessments. A database-save failure returns an error rather than an unsaved success.

Demo mode uses labelled predefined examples. Edited evidence returns Not assessed in demo mode; live mode calls OpenAI. Structured output checks format, not scientific correctness. Model confidence is self-reported and is not a clinical probability. Human review remains necessary.

See [Current implementation](ClaimLens-Current-Implementation.md) for the schema and request flow.

## 4. Product roadmap

Extend the product across proposal, feasibility screening, formulation development, product evaluation and reporting. Keep scientific and business decisions with their responsible owners.

See [Future implementation and roadmap](Future-Implementation.md) for the proposed data model, stages and AI capabilities.
