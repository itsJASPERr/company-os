import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  // In GitHub Codespaces the workspace is on a network drive; redirect the
  // Next.js output to /tmp so Turbopack uses the local (tmpfs) filesystem.
  ...(process.env.CODESPACES === "true" && { distDir: "/tmp/.next" }),
};

export default nextConfig;
