const prompt = require("prompt-sync")();
import { Octokit } from "@octokit/rest";
import { execSync } from "child_process";
import { join } from "path";
import fs from "fs";
import { OpenAI } from "openai";

type GithubCredentials = {
  username: string;
  token: string;
};

require("dotenv").config({ path: `.env.local` });

const tsxRegex = /```tsx([\s\S]*?)```/;
const jsonRegex = /```json([\s\S]*?)```/;

async function processAI({ prompt }: { prompt: string }): Promise<{
  fileContent: string;
  dependencies: { [key: string]: string };
}> {
  if (process.env.OPENAI_API_KEY === undefined) {
    throw new Error("OpenAI API key not found. Please set it in the .env file.");
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "gpt-4",
  });

  const content = chatCompletion.choices[0].message.content ?? "";

  console.log("before regex fileContent", content);

  const fileContentMatch = content.match(tsxRegex)?.[0] ?? "";
  const fileContent = fileContentMatch.replace("```tsx", "").replace("```", "");

  const dependenciesMatch = content.match(jsonRegex)?.[0] ?? "";
  const dependencies = JSON.parse(
    dependenciesMatch.replace("```json", "").replace("```", ""),
  );

  return {
    fileContent,
    dependencies: (dependencies ?? {}) as Record<string, string>,
  };
}

function writeToFile(filePath: string, data: string) {
  try {
    fs.writeFileSync(filePath, data);
  } catch (error: any) {
    if (error) {
      console.error("Error writing to file:", error.message);
    } else {
      console.log("Data written to file successfully.");
    }
  }
}

async function generateRepo({
  gitHubCredentials,
  templateName = "react-ts",
  newRepoName,
  libName = "@mui/material",
  libVersion = "5.14.17",
}: {
  gitHubCredentials: GithubCredentials;
  templateName?: string;
  newRepoName: string;
  libName?: string;
  libVersion?: string;
}) {
  const cleanupUserTemplateFolder = () => {
    try {
      execSync(`rm -rf ${userTemplateAbsolutePath}/*`);
    } catch {}
    try {
      execSync(`rm -rf ${userTemplateAbsolutePath}/.git`);
    } catch {}
  };

  const userTemplateAbsolutePath = join(__dirname, "user_templates");

  cleanupUserTemplateFolder();

  try {
    const aiProcessingPromise = processAI({
      prompt: `Give me an example of the library ${libName}@${libVersion} in tsx that exports a default component with the name App, with a date-picker. 
       I don't need instructions on how to install ${libName}.
       Also give me a flat json just with all the dependencies you've explicitly through import statements used on the example. The dependency name should be a key and the version should be the value.
       These peer dependencies should respect the version of the library ${libName}@${libVersion} that I specified.
       Use explicit dependency versions. Do not use ^ or ~. If one dependency has peer dependencies, include them as well.
       Make sure these dependencies match the version of their peers at the time of the example.
       Do not include any text besides the \`\`\`tsx\`\`\` and  \`\`\`json\`\`\` code blocks.
       Note that these dependency names can not contain more than one forward slash in the json code block.
       `,
    });

    execSync(
      `cp -r ${join(__dirname, `preset_templates/${templateName}/*`)} ${join(
        __dirname,
        "user_templates",
      )}`,
    );

    const [{ fileContent, dependencies }] = await Promise.all([aiProcessingPromise]);

    writeDependencyToPackageJson({
      packageJsonPath: join(userTemplateAbsolutePath, "package.json"),
      newDependencies: dependencies,
    });

    // console.log("after regex fileContent", fileContent);

    writeToFile(join(userTemplateAbsolutePath, "src/App.tsx"), fileContent);

    // Create GitHub repository
    // await createRepository(gitHubCredentials, newRepoName);

    // // Initialize local git repository
    // initializeLocalRepo(userTemplateAbsolutePath);

    // // Add and commit local changes
    // addAndCommitChanges(userTemplateAbsolutePath);

    // // Push changes to GitHub repository
    // pushToGitHub({
    //   credentials: gitHubCredentials,
    //   repoName: newRepoName,
    //   repoPath: userTemplateAbsolutePath,
    // });
  } catch (error: any) {
    console.error("An unexpected error occurred:", error.message);
  } finally {
    // cleanupUserTemplateFolder();
  }
}

// Main function
async function main() {
  // const newRepoName = prompt("Enter the name for the new GitHub repository: ");
  const newRepoName = "cavalo";

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
  newDependencies,
}: {
  packageJsonPath: string;
  newDependencies: Record<string, string>;
}) {
  // Read the package.json file
  fs.readFile(packageJsonPath, "utf8", function (err, data) {
    if (err) {
      console.error("Error reading the package.json file:", err);
      return;
    }

    type RawPackageJson = {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    } & Record<string, unknown>;

    // Parse the JSON data
    let packageObj: RawPackageJson = { dependencies: {}, devDependencies: {} };
    try {
      packageObj = JSON.parse(data);
    } catch (parseErr) {
      console.error("Error parsing JSON from package.json:", parseErr);
      return;
    }

    const filteredNewDependencies = Object.entries(newDependencies).reduce<
      Record<string, string>
    >((acc, [key, value]) => {
      if (!packageObj.dependencies?.[key] && !packageObj.devDependencies?.[key]) {
        acc[key] = value;
      }
      return acc;
    }, {});

    // Insert the new dependencies. These should not override the existing ones on the template
    packageObj.dependencies = { ...packageObj.dependencies, ...filteredNewDependencies };

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
