const { config, config_categories } = require("./data/app.data.seeders");
const App = require("../models/app.models");

const app_config_categories_seeder = async () => {
  try {
    const existingCount = await App.Category.count();

    if (existingCount === 0) {
      await App.Category.bulkCreate(config_categories, {
        updateOnDuplicate: ["name"],
      });
      console.log(
        "\x1b[34mAPP CONFIG CATEGORIES TABLE STATUS:\x1b[0m",
        "\x1b[32mSYNC\x1b[0m"
      );
    } else {
      console.log(
        "\x1b[34mAPP CONFIG CATEGORIES TABLE STATUS:\x1b[0m",
        "\x1b[33mEXISTING RECORDS FOUND, NO NEW RECORDS ADDED\x1b[0m"
      );
    }
  } catch (err) {
    console.error(err);
  }
};

const app_config_seeder = async () => {
  try {
    const existingCount = await App.Config.count();

    if (existingCount === 0) {
      await App.Config.bulkCreate(config, {
        updateOnDuplicate: ["key"],
      });
      console.log(
        "\x1b[34mAPP CONFIG TABLE STATUS:\x1b[0m",
        "\x1b[32mSYNC\x1b[0m"
      );
    } else {
      console.log(
        "\x1b[34mAPP CONFIG TABLE STATUS:\x1b[0m",
        "\x1b[33mEXISTING RECORDS FOUND, NO NEW RECORDS ADDED\x1b[0m"
      );
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = { app_config_seeder, app_config_categories_seeder };
