import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { migrator } from "./migrator";

export interface TestSetupOptions {
  models: any[];
}

export async function setupTestDatabase(options: TestSetupOptions): Promise<{ sequelize: Sequelize; migration: Umzug<any> }> {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });

  sequelize.addModels(options.models);
  const migration = migrator(sequelize);
  await migration.up();

  return { sequelize, migration };
}

export async function teardownTestDatabase(sequelize: Sequelize, migration: Umzug<any>): Promise<void> {
  if (!migration || !sequelize) {
    return;
  }
  await migration.down();
  await sequelize.close();
} 
