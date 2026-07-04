import { initializeDatabase } from "./init-db";

let initialized = false;

export function bootstrap() {
  if (initialized) return;

  initializeDatabase();

  initialized = true;
}