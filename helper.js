const fs = require("fs");
const path = require("path");
const base64 = require("base-64");

function getEnvPath(environment) {
  const usersFilePath = path.join(__dirname, `users_${environment}.json`);
  return usersFilePath;
}

function handleError(res, errorType) {
  let statusCode;
  let message;

  switch (errorType) {
    case "missing_auth":
      statusCode = 400;
      message = "Authroization is Required!";
      break;
    case "missing_username":
      statusCode = 400;
      message = "Username is Required!";
      break;
    case "missing_password":
      statusCode = 400;
      message = "Password is Required!";
      break;
    case "wrong_username":
      statusCode = 401;
      message = "Username is Incorect!";
      break;
    case "wrong_password":
      statusCode = 401;
      message = "Password is Incorect!";
      break;
    case "error":
      statusCode = 500;
      message = "user_parse_error";
    default:
      statusCode = 500;
      message = "Something went wrong";
  }

  return res.status(statusCode).json({
    status: statusCode,
    error: message,
  });
}

function checkCredentials(req) {
  if (!req.headers || !req.headers.authorization) {
    return "missing_auth";
  }

  const authHeader = req.headers.authorization;
  const credentials = base64.decode(authHeader.substring(6));
  const [username, password] = credentials.split(":");
  const usersFilePath = path.join(__dirname, "users_basic_auth.json");
  const users = JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));
  const foundUser = users.find((u) => u.username === username);

  if (!username) {
    return "missing_username";
  }
  if (!password) {
    return "missing_password";
  }
  if (!foundUser) {
    return "wrong_username";
  }

  for (user of users) {
    if (user.username === username && user.password != password) {
      return "wrong_password";
    }
  }

  for (const user of users) {
    if (user.username === username && user.password === password) {
      console.log("User Authorized: " + user.username);
      return null;
    }
  }
  return "user_parse_error";
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
  console.log(data);
  fs.readFile(filepath, "utf8", (err, readData) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    try {
      const jsonData = JSON.parse(readData);
      jsonData.push(data);
      fs.writeFile(filepath, JSON.stringify(jsonData, null, 4), (err) => {
        if (err) {
          console.error("Error writing file:", err);
        } else {
          console.log("New data appended successfully!");
        }
      });
    } catch (err) {
      console.error("Error parsing JSON:", err);
    }
  });
}

function readFromFile(filepath, last, first) {
  try {
    const fileContent = fs.readFileSync(filepath, "utf8");
    getData = JSON.parse(fileContent);
    if (!last) {
      return getData;
    } else {
      return getData[getData.length - 1];
    }
  } catch (error) {
    console.error(`Error reading files from ${filepath}`);
    error.message;
  }
}

function resetFile(filePath) {
  fs.writeFileSync(filePath, JSON.stringify([]), "utf8");
}

function deleteLastItem(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (data.length > 0) {
    data.pop(); // Remove the last item
    fs.writeFileSync(filePath, JSON.stringify(data), "utf8");
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
  writeToFile,
  readFromFile,
  resetFile,
  deleteLastItem,
  checkCredentials,
  handleError,
};
