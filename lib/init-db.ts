import fs from "fs";
import path from "path";
import db from "./db";

export function initializeDatabase() {
  // If the goals table does not yet exist the old single-table schema is in
  // place.  Drop the incompatible plans table so the new schema can be applied
  // cleanly.  This is safe because no old plan data is compatible with the new
  // goals + plans structure.
  const goalsExists = db
    .prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='goals'"
    )
    .get();

  if (!goalsExists) {
    db.exec("DROP TABLE IF EXISTS plans");
  }

  const schemaPath = path.join(process.cwd(), "db", "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf8");
  db.exec(schema);

  // Migrate existing plans table: add why and dag columns if they don't exist.
  const plansColumns = db
    .prepare("PRAGMA table_info(plans)")
    .all() as { name: string }[];
  const columnNames = plansColumns.map((c) => c.name);

  if (!columnNames.includes("why")) {
    db.exec("ALTER TABLE plans ADD COLUMN why TEXT NOT NULL DEFAULT ''");
  }
  if (!columnNames.includes("dag")) {
    db.exec("ALTER TABLE plans ADD COLUMN dag TEXT NOT NULL DEFAULT '[]'");
  }
}