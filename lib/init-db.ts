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
}