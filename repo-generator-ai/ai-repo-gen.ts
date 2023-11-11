const prompt = require("prompt-sync")();
const { Octokit } = require("@octokit/rest");
const { execSync } = require("child_process");
const { join } = require("path");
import fs from "fs";

type Credentials = {
  username: string;
  token: string;
};

require("dotenv").config({ path: `.env.local` });

// Main function
async function main() {
  try {
    // Get user input
    const credentials = getGitHubCredentials();
    const repoName = prompt("Enter the name for the new GitHub repository: ");
    // const repoPath = prompt("Enter the local path of the code to push: ");

    execSync(
      `cp -r ${join(__dirname, "preset_templates/*")} ${join(
        __dirname,
        "user_templates",
      )}`,
    );
    const userTemplateAbsolutePath = join(__dirname, "user_templates");

    // Create GitHub repository
    await createRepository(credentials, repoName);

    // Initialize local git repository
    initializeLocalRepo(userTemplateAbsolutePath);

    // Add and commit local changes
    addAndCommitChanges(userTemplateAbsolutePath);

    // Push changes to GitHub repository
    pushToGitHub(credentials, repoName, userTemplateAbsolutePath);

    execSync(`rm -rf ${userTemplateAbsolutePath}/*`);
    execSync(`rm -rf ${userTemplateAbsolutePath}/.git`);
  } catch (error) {
    console.error("An unexpected error occurred:", error.message);
  }
}

// Run the script
main();

function getGitHubCredentials(): Credentials {
  // const username = prompt("Enter your GitHub username: ");
  const username = process.env.GITHUB_USERNAME ?? "";
  // const token = prompt.hide("Enter your GitHub personal access token: "); // Use prompt.hide to hide the token input
  const token = process.env.GITHUB_TOKEN ?? "";
  return { username, token };
}

// Function to create a new GitHub repository
async function createRepository(credentials: Credentials, repoName: string) {
  try {
    const octokit = new Octokit({
      auth: credentials.token,
    });

    // Create the repository
    const response = await octokit.repos.createForAuthenticatedUser({
      name: repoName,
    });

    console.log(`Repository '${repoName}' created successfully on GitHub.`);
  } catch (error) {
    console.error("Error creating repository:", error.message);
  }
}

// Function to initialize a local git repository
function initializeLocalRepo(repoPath: string) {
  try {
    execSync(`git init "${repoPath}"`);
    console.log("Local repository initialized successfully.");
  } catch (error) {
    console.error("Error initializing local repository:", error.message);
  }
}

// Function to add and commit local changes
function addAndCommitChanges(repoPath: string) {
  try {
    execSync(`cd "${repoPath}" && git add .`);
    execSync(`cd "${repoPath}" && git commit -m "Initial commit"`);
    console.log("Local changes committed successfully.");
  } catch (error) {
    console.error("Error adding and committing changes:", error.message);
  }
}

// Function to push changes to the GitHub repository
function pushToGitHub(credentials: Credentials, repoName: string, repoPath: string) {
  try {
    execSync(
      `cd "${repoPath}" && git remote add origin https://${credentials.username}:${credentials.token}@github.com/${credentials.username}/${repoName}.git`,
    );
    execSync(`cd "${repoPath}" && git push -u origin master`);
    console.log("Code pushed to GitHub repository successfully.");
  } catch (error) {
    console.error("Error pushing to GitHub repository:", error.message);
  }
}

// ---------------------------------------------------------------------------------------------

// // The path to your package.json file
// const packageJsonPath = "./package.json";

// // Get the new dependency details from command line arguments
// const newDependencyName = process.argv[2];
// const newDependencyVersion = process.argv[3];

// // Check if arguments are provided
// if (!newDependencyName || !newDependencyVersion) {
//   console.error("Please provide the name and version of the new dependency.");
//   process.exit(1);
// }

// The new dependency to add
// const newDependency = {
//   [newDependencyName]: newDependencyVersion,
// };

function writeDependencyToPackageJson({
  packageJsonPath,
  newDependency: { name: newDependencyName, version: newDependencyVersion = "latest" },
}: {
  packageJsonPath: string;
  newDependency: { name: string; version?: string };
}) {
  // Read the package.json file
  fs.readFile(packageJsonPath, "utf8", function (err, data) {
    if (err) {
      console.error("Error reading the package.json file:", err);
      return;
    }

    // Parse the JSON data
    let packageObj;
    try {
      packageObj = JSON.parse(data);
    } catch (parseErr) {
      console.error("Error parsing JSON from package.json:", parseErr);
      return;
    }

    const newDependency = {
      [newDependencyName]: newDependencyVersion,
    };
    // Insert the new dependency
    packageObj.dependencies = { ...packageObj.dependencies, ...newDependency };

    // Convert the modified object back to a JSON string
    const updatedPackageJson = JSON.stringify(packageObj, null, 2); // "null, 2" for pretty formatting

    // Write the updated JSON string back to the package.json file
    fs.writeFile(packageJsonPath, updatedPackageJson, "utf8", function (writeErr) {
      if (writeErr) {
        console.error("Error writing to package.json:", writeErr);
        return;
      }
      console.log("New dependency has been added to package.json");
    });
  });
}
