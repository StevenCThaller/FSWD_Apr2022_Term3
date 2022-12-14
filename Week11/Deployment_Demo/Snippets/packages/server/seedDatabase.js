import chalk from "chalk";
import keys from "./config/keys";
import Post from "./models/post";
import User from "./models/user";

import exec from "await-exec";

async function seedDatabase() {
  try {
    const users = await User.find({});
    const posts = await Post.find({});
    if (users.length === 0 && posts.length === 0) {
      console.log(
        chalk.yellow(
          "No users or posts in the database, creating sample data..."
        )
      );

      await exec(
        `mongoimport --collection=posts --db=${keys.database.db_name} --file=./db/posts.json ${keys.database.url}`
      );
      await exec(
        `mongoimport --collection=users --db=${keys.database.db_name} --file=./db/users.json ${keys.database.url}`
      );

      console.log(chalk.green(`Successfully populated database!!`));
    } else {
      console.log(
        chalk.yellow("Database already initiated, skipping populating script")
      );
    }
  } catch (error) {
    console.log(chalk.red(error));
  }
}

module.exports = seedDatabase;
