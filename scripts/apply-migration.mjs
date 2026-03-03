#!/usr/bin/env node
/**
 * Apply B2B Platform Migration (002_b2b_platform.sql) to Supabase
 *
 * Usage:
 *   node scripts/apply-migration.mjs
 *
 * Requirements:
 *   - .env.local must have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 *   - Or pass them as env vars:
 *     NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/apply-migration.mjs
 *
 * Alternative: Copy the SQL from supabase/migrations/002_b2b_platform.sql
 * and paste it in Supabase Dashboard > SQL Editor > New Query > Run.
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");

// Load .env.local
function loadEnv() {
  try {
    const envContent = readFileSync(resolve(rootDir, ".env.local"), "utf-8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx);
      const value = trimmed.slice(eqIdx + 1);
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env.local not found, rely on env vars
  }
}

loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required."
  );
  console.error("Set them in .env.local or as environment variables.");
  process.exit(1);
}

const MIGRATION_FILE = resolve(
  rootDir,
  "supabase/migrations/20260301000001_b2b_platform.sql"
);

async function executeSql(sql) {
  // Use Supabase pg-meta API to execute raw SQL
  const response = await fetch(`${SUPABASE_URL}/pg/query`, {
    method: "POST",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      "X-Connection-Encrypted": "true",
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!response.ok) {
    // Fallback: try the rpc approach with a wrapper function
    const fallbackResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: "POST",
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql_text: sql }),
    });

    if (!fallbackResponse.ok) {
      const errorText = await response.text();
      throw new Error(
        `SQL execution failed (${response.status}): ${errorText}`
      );
    }

    return fallbackResponse.json();
  }

  return response.json();
}

async function main() {
  console.log("=== Kısmet Plastik B2B Migration ===\n");
  console.log(`Supabase URL: ${SUPABASE_URL}`);
  console.log(`Migration: ${MIGRATION_FILE}\n`);

  // Read migration SQL
  const sql = readFileSync(MIGRATION_FILE, "utf-8");
  console.log(`SQL size: ${sql.length} bytes (${sql.split("\n").length} lines)`);

  // Verify connectivity
  console.log("\nTesting connection...");
  try {
    const testResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
    });
    if (!testResponse.ok) {
      throw new Error(`HTTP ${testResponse.status}`);
    }
    console.log("Connection OK\n");
  } catch (err) {
    console.error(`Connection failed: ${err.message}`);
    console.error(
      "\nAlternative: Copy the SQL and paste it in Supabase Dashboard > SQL Editor"
    );
    process.exit(1);
  }

  // Execute migration
  console.log("Applying migration...");
  try {
    const result = await executeSql(sql);
    console.log("\nMigration applied successfully!");
    console.log("Result:", JSON.stringify(result, null, 2).substring(0, 500));
  } catch (err) {
    console.error(`\nMigration failed: ${err.message}`);
    console.error(
      "\nAlternative: Copy the SQL from the migration file and run it in:"
    );
    console.error("  Supabase Dashboard > SQL Editor > New Query > Run");
    process.exit(1);
  }

  // Verify tables
  console.log("\nVerifying tables...");
  try {
    const tables = [
      "companies",
      "b2b_profiles",
      "price_tiers",
      "b2b_orders",
      "b2b_order_items",
      "b2b_quote_requests",
      "saved_designs",
    ];

    for (const table of tables) {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/${table}?select=id&limit=0`,
        {
          headers: {
            apikey: SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          },
        }
      );
      const status = res.ok ? "OK" : `MISSING (${res.status})`;
      console.log(`  ${table}: ${status}`);
    }
  } catch (err) {
    console.error(`Verification error: ${err.message}`);
  }

  console.log("\n=== Migration Complete ===");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
