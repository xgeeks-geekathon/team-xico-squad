const prompt = require("prompt-sync")();
const { Octokit } = require("@octokit/rest");
const { execSync } = require("child_process");
const fs = require("fs");
const { join } = require("path");

type Credentials = {
  username: string;
  token: string;
};

// Function to get GitHub credentials from the user
function getGitHubCredentials(): Credentials {
  // const username = prompt("Enter your GitHub username: ");
  const username = "rodrigofariow";
  // const token = prompt.hide("Enter your GitHub personal access token: "); // Use prompt.hide to hide the token input
  const token = "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";
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
