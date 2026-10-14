# ClaimLens

A local claims intelligence prototype: review fictional beauty product claims against study evidence using React, NestJS, Prisma, and optional OpenAI assessments.

## Run

Requires Node.js 22.12 or newer; Node 24 LTS is recommended.

```sh
npm install
npm run dev
```

Open http://localhost:3000. The NestJS API runs on port 3001. Both servers start together. No database server or Docker is required.

Default demo mode works without an API key. Five fictional claims are seeded into real in-memory SQLite through Prisma. Data resets when the backend restarts.

## Live OpenAI mode

Copy `backend/.env.example` to `backend/.env`, set `ASSESSMENT_MODE=live` and your `OPENAI_API_KEY`, then restart the app. `OPENAI_MODEL` is configurable and must support structured Chat Completions output. The API key remains on the backend. Demo fixtures are explicitly labelled; edited evidence requires live mode for an actual model assessment.

## Build and run compiled output

```sh
npm run build
npm start
```

To run the apps separately:

```sh
npm run dev --prefix backend
npm run dev --prefix frontend
```

## Application structure

- `frontend/src/components`: Home, Claims, Evaluation, results, and shared UI components.
- `frontend/src/api.ts`: frontend API client.
- `backend/src/app.ts`: NestJS controller and assessment workflow.
- `backend/src/assessment.ts`: OpenAI structured output, prompt, validation, and demo fixtures.
- `backend/src/database.ts`: singleton in-memory database initialization.
- `backend/src/seed.ts`: fictional product claims and study summaries.
- `backend/prisma/schema.prisma`: Claim and Assessment models.

The API exposes `GET /api/health`, `GET /api/claims`, `GET /api/claims/:id`, and `POST /api/claims/assess`. Assessments retain the submitted wording, evidence, verdict, confidence, reasoning, evidence gaps, model, prompt version, and mode.

Model confidence is not a clinical probability. Assessments support human scientific review and do not constitute regulatory approval. This is a local assessment prototype without authentication or production approval workflows.

Only application source and essential setup files are included. Test folders, Windows launchers, local documents, dependencies, build output, and secrets are excluded by `.gitignore`.
