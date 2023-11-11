const prompt = require("prompt-sync")();
const { Octokit } = require("@octokit/rest");
const { execSync } = require("child_process");
const fs = require("fs");

// Function to get GitHub credentials from the user
function getGitHubCredentials() {
  const username = prompt("Enter your GitHub username: ");
  const token = prompt.hide("Enter your GitHub personal access token: "); // Use prompt.hide to hide the token input
  return { username, token };
}

// Function to create a new GitHub repository
async function createRepository(credentials, repoName) {
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
function initializeLocalRepo(repoPath) {
  try {
    execSync(`git init "${repoPath}"`);
    console.log("Local repository initialized successfully.");
  } catch (error) {
    console.error("Error initializing local repository:", error.message);
  }
}

// Function to add and commit local changes
function addAndCommitChanges(repoPath) {
  try {
    execSync(`cd "${repoPath}" && git add .`);
    execSync(`cd "${repoPath}" && git commit -m "Initial commit"`);
    console.log("Local changes committed successfully.");
  } catch (error) {
    console.error("Error adding and committing changes:", error.message);
  }
}

// Function to push changes to the GitHub repository
function pushToGitHub(credentials, repoName, repoPath) {
  try {
    execSync(
      `cd "${repoPath}" && git remote add origin https://${credentials.username}:${credentials.token}@github.com/${credentials.username}/${repoName}.git`
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
    const repoPath = prompt("Enter the local path of the code to push: ");

    // Create GitHub repository
    await createRepository(credentials, repoName);

    // Initialize local git repository
    initializeLocalRepo(repoPath);

    // Add and commit local changes
    addAndCommitChanges(repoPath);

    // Push changes to GitHub repository
    pushToGitHub(credentials, repoName, repoPath);
  } catch (error) {
    console.error("An unexpected error occurred:", error.message);
  }
}

// Run the script
main();
