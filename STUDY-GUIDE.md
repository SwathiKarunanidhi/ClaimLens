# ClaimLens study guide

1. React sends claimId, exact claim wording and submitted evidence to POST /api/claims/assess.
2. NestJS validates the request with Zod and checks the saved claim.
3. The assessment engine uses predefined examples in demo mode or calls OpenAI in live mode.
4. The backend validates the result and saves wording/evidence snapshots, model, prompt version and mode through Prisma.
5. React displays the recommendation, reasoning, gaps and assessment history.

One Claim has many Assessments. SQLite runs in memory and resets on restart.
Mode is demo or live; structured output does not establish scientific correctness.
React runs on 3000 and NestJS runs on 3001. Model API keys remain in the backend.
