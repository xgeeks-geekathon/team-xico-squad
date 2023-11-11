const prompt = require("prompt-sync")();
import { Octokit } from "@octokit/rest";
import { execSync } from "child_process";
import { join } from "path";
import fs from "fs";

type GithubCredentials = {
  username: string;
  token: string;
};

require("dotenv").config({ path: `.env.local` });

async function generateRepo({
  gitHubCredentials,
  templateName = "react-ts",
  newRepoName,
}: {
  gitHubCredentials: GithubCredentials;
  templateName?: string;
  newRepoName: string;
}) {
  const userTemplateAbsolutePath = join(__dirname, "user_templates");
  try {
    execSync(
      `cp -r ${join(__dirname, `preset_templates/${templateName}/*`)} ${join(
        __dirname,
        "user_templates",
      )}`,
    );

    writeDependencyToPackageJson({
      packageJsonPath: join(userTemplateAbsolutePath, "package.json"),
      newDependency: { name: "zod", version: "latest" },
    });

    // Create GitHub repository
    await createRepository(gitHubCredentials, newRepoName);

    // Initialize local git repository
    initializeLocalRepo(userTemplateAbsolutePath);

    // Add and commit local changes
    addAndCommitChanges(userTemplateAbsolutePath);

    // Push changes to GitHub repository
    pushToGitHub({
      credentials: gitHubCredentials,
      repoName: newRepoName,
      repoPath: userTemplateAbsolutePath,
    });
  } catch (error: any) {
    console.error("An unexpected error occurred:", error.message);
  } finally {
    execSync(`rm -rf ${userTemplateAbsolutePath}/*`);
    execSync(`rm -rf ${userTemplateAbsolutePath}/.git`);
  }
}

// Main function
async function main() {
  const newRepoName = prompt("Enter the name for the new GitHub repository: ");

  await generateRepo({
    gitHubCredentials: getGitHubCredentials(),
    templateName: "react-ts",
    newRepoName,
  });
}

// Run the script
main();

function getGitHubCredentials(): GithubCredentials {
  // const username = prompt("Enter your GitHub username: ");
  const username = process.env.GITHUB_USERNAME ?? "";
  // const token = prompt.hide("Enter your GitHub personal access token: "); // Use prompt.hide to hide the token input
  const token = process.env.GITHUB_TOKEN ?? "";
  return { username, token };
}

// Function to create a new GitHub repository
async function createRepository(credentials: GithubCredentials, repoName: string) {
  try {
    const octokit = new Octokit({
      auth: credentials.token,
    });

    // Create the repository
    const response = await octokit.repos.createForAuthenticatedUser({
      name: repoName,
    });

    console.log(`Repository '${repoName}' created successfully on GitHub.`);
  } catch (error: any) {
    console.error("Error creating repository:", error.message);
  }
}

// Function to initialize a local git repository
function initializeLocalRepo(repoPath: string) {
  try {
    execSync(`git init "${repoPath}"`);
    console.log("Local repository initialized successfully.");
  } catch (error: any) {
    console.error("Error initializing local repository:", error.message);
  }
}

// Function to add and commit local changes
function addAndCommitChanges(repoPath: string) {
  try {
    execSync(`cd "${repoPath}" && git add .`);
    execSync(`cd "${repoPath}" && git commit -m "Initial commit"`);
    console.log("Local changes committed successfully.");
  } catch (error: any) {
    console.error("Error adding and committing changes:", error.message);
  }
}

// Function to push changes to the GitHub repository
function pushToGitHub({
  credentials,
  repoName,
  repoPath,
}: {
  credentials: GithubCredentials;
  repoName: string;
  repoPath: string;
}) {
  try {
    execSync(
      `cd "${repoPath}" && git remote add origin https://${credentials.username}:${credentials.token}@github.com/${credentials.username}/${repoName}.git`,
    );
    execSync(`cd "${repoPath}" && git push -u origin master`);
    console.log("Code pushed to GitHub repository successfully.");
  } catch (error: any) {
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
