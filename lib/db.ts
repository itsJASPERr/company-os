import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "companyos.db");

const db = new Database(dbPath);

// Better reliability
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

export default db;