import fs from "fs";
import path from "path";
import db from "./db";

export function initializeDatabase() {
  const schemaPath = path.join(process.cwd(), "db", "schema.sql");

  const schema = fs.readFileSync(schemaPath, "utf8");

  db.exec(schema);
}