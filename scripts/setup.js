require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const { db } = require("../database/config");
const init = require("../models/init.models");
const { app_config_categories_seeder, app_config_seeder } = require("../seeders/app.seeders");
const { roles_seeder, doc_types_seeder, via_types_seeder } = require("../seeders/accounts.seeders");
const { gimnasios_seeder } = require("../seeders/gimnasios.seeders");

const SCHEMAS = ["accounts", "auth", "app"];

// Tables that must be dropped and recreated when the model schema changes.
// Order matters: dependents first (FK constraints).
const RESET_TABLES = [
  '"auth"."auth_codes"',
  '"app"."reservas"',
  '"accounts"."addresses"',
  '"accounts"."accounts"',
  '"accounts"."roles"',
  '"accounts"."doc_types"',
];

async function setup() {
  try {
    await db.authenticate();
    console.log("✔  Database connected");

    for (const schema of SCHEMAS) {
      await db.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);
      console.log(`✔  Schema "${schema}" ready`);
    }

    // Drop stale tables so sync recreates them with the current model definition
    for (const table of RESET_TABLES) {
      await db.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
      console.log(`✔  Dropped ${table} (will be recreated)`);
    }

    init();

    await db.sync({ force: false });
    console.log("✔  Tables synchronized");

    await roles_seeder();
    await doc_types_seeder();
    await via_types_seeder();
    await gimnasios_seeder();
    await app_config_categories_seeder();
    await app_config_seeder();
    console.log("✔  Seeders completed");

    console.log("\n✅  Setup finished successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌  Setup failed:", err.message || err);
    process.exit(1);
  }
}

setup();
