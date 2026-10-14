import { NestFactory } from "@nestjs/core";
import { config } from "dotenv";
import { resolve } from "node:path";
import "reflect-metadata";
import { AppModule } from "./app";

config({ path: resolve(__dirname, "../.env"), quiet: true });
async function bootstrap() {
  const mode = process.env.ASSESSMENT_MODE || "demo";
  if (!["demo", "live"].includes(mode))
    throw new Error("ASSESSMENT_MODE must be demo or live.");
  const app = await NestFactory.create(AppModule, { bodyParser: true });
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"],
  });
  app.enableShutdownHooks();
  await app.listen(Number(process.env.PORT || 3001), "127.0.0.1");
  console.log(
    `ClaimLens API: http://localhost:${process.env.PORT || 3001}/api — ${mode} mode; memory resets on restart.`,
  );
}
bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
