const fs = require("fs");
const path = require("path");
const base64 = require("base-64");

function getEnvPath(environment) {
  const usersFilePath = path.join(__dirname, `users_${environment}.json`);
  return usersFilePath;
}

function checkBasicAuthFromRequest(request) {
  if (!request.headers || !request.headers.authorization) {
    console.log("Request headers not passed");
    return false;
  }

  const authHeader = request.headers.authorization;
  if (!authHeader.startsWith("Basic ")) {
    console.log("Basic authorization is missing");
    return false;
  }

  const credentials = base64.decode(authHeader.substring(6));
  const [username, password] = credentials.split(":");

  const usersFilePath = path.join(__dirname, "users_basic_auth.json");
  const users = JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));

  for (const user of users) {
    if (user.username === username && user.password === password) {
      console.log("User authorized to perform an action");
      return true;
    }
  }
  return false;
}

function login_change(username, loggedIn) {
  const users = JSON.parse(fs.readFileSync("users_basic_auth.json", "utf8"));
  console.log(username);
  const user = users.find((user) => user.username === username);

  if (!user) {
    throw new Error("Username not found");
  }

  // Update the loggedIn status for the user
  user.loggedIn = loggedIn;

  fs.writeFileSync("users_basic_auth.json", JSON.stringify(users, null, 2));

  console.log(`Logged in status updated for user ${username}`);
}

// Read the users_basic_auth.json file and return its contents
function getUsersCredentials() {
  try {
    const usersCredentials = JSON.parse(
      fs.readFileSync("users_basic_auth.json", "utf8"),
    );
    return usersCredentials;
  } catch (error) {
    console.error("Error reading users_basic_auth.json:", error.message);
    return [];
  }
}

// Function to write user data to the JSON file
function writeUsersToFile(usersFilePath) {
  try {
    const usersData = JSON.stringify(users, null, 2);
    fs.writeFileSync(usersFilePath, usersData, "utf8");
  } catch (error) {
    console.error(
      `Error writing users file for ${usersFilePath} environment:`,
      error.message,
    );
  }
}

function readUsersFromFile(usersFilePath, environment) {
  try {
    const usersData = fs.readFileSync(usersFilePath, "utf8");
    users = JSON.parse(usersData);
    return users;
  } catch (error) {
    console.error(
      `Error reading users file for ${environment} environment:`,
      error.message,
    );
    return error(
      `Error reading users file for ${environment} environment:`,
      error.message,
    );
  }
}

// Function to generate a unique ID for a new user
function generateUniqueId() {
  return users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1;
}

function writeToFile(data, filepath) {
  try {
    const data = JSON.stringify(data, null, 2);
    fs.writeFileSync(filepath, data, "utf8");
  } catch (error) {
    console.error(`Error writing to ${filepath}`, error.message);
  }
}

function readFromFile(filepath, last, first) {
  try {
    const fileContent = fs.readFileSync(filepath, "utf8");
    data = JSON.parse(fileContent);
    if (!last) {
      return data;
    } else {
      return data.slice(-1)[0];
    }
  } catch (error) {
    console.error("Error reading files from ${filepath}");
    error.message;
  }
}

module.exports = {
  getEnvPath,
  login_change,
  getUsersCredentials,
  writeUsersToFile,
  readUsersFromFile,
  checkBasicAuthFromRequest,
  generateUniqueId,
};
