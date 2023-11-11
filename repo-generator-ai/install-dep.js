/* eslint-disable no-undef */
import fs from "fs";

// The path to your package.json file
const packageJsonPath = "./package.json";

// Get the new dependency details from command line arguments
const newDependencyName = process.argv[2];
const newDependencyVersion = process.argv[3];

// Check if arguments are provided
if (!newDependencyName || !newDependencyVersion) {
  console.error("Please provide the name and version of the new dependency.");
  process.exit(1);
}

// The new dependency to add
const newDependency = {
  [newDependencyName]: newDependencyVersion,
};

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
