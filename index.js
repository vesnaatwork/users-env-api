const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const {
  getEnvPath,
  getUsersCredentials,
  login_change,
  writeUsersToFile,
  readUsersFromFile,
  checkBasicAuthFromRequest,
  generateUniqueId,
} = require("./helper");

const { parseArgs } = require("util");

app.use(
  cors({
    exposedHeaders: ["Date"],
  }),
);

app.use(express.json());
app.use(bodyParser.json());

// Define the environment
const environment = process.argv[2] || "qa";
const usersFilePath = getEnvPath(environment);

// GET endpoint to retrieve all users
app.get("/users", (req, res) => {
  try {
    const users = readUsersFromFile(usersFilePath);
    if (users instanceof Error) {
      throw users; // If readUsersFromFile returns an error, throw it
    }
    res.status(200).json(users);
  } catch (error) {
    console.error(
      `Error reading users file for ${environment} environment:`,
      error.message,
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const users = readUsersFromFile(usersFilePath);
  if (!isNaN(userId)) {
    const user = users.find((u) => u.id === userId);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } else {
    res.status(400).json({ message: "Invalid user ID" });
  }
});

// POST endpoint to add a new user
app.post("/users", (req, res) => {
  const { name, age } = req.body;
  const users = readUsersFromFile(usersFilePath);
  const result = checkBasicAuthFromRequest(req);

  if (!result) {
    return res.status(401).send("Unauthorized access");
  }

  if (!name) {
    res.status(400).json({ message: "Name is required" });
    return;
  }

  const newUser = {
    id: generateUniqueId(),
    name,
    age: age || null,
  };

  users.push(newUser);
  writeUsersToFile(usersFilePath); // Update the users file
  res.status(200).json(newUser);
});

// PUT endpoint to edit user by ID
app.put("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const updatedUser = req.body;
  const users = readUsersFromFile(usersFilePath, environment);
  const index = users.findIndex((u) => u.id === userId);

  const result = checkBasicAuthFromRequest(req);

  if (!result) {
    return res.status(401).send("Unauthorized access");
  }

  if (index !== -1 && updatedUser && updatedUser.name && updatedUser.age) {
    users[index] = { ...users[index], ...updatedUser };
    writeUsersToFile(usersFilePath);
    res.status(200).json(users[index]);
  } else {
    res.status(400).json({ message: "Invalid user data or user not found" });
  }
});

// PATCH endpoint to update name and/or age for an existing user
app.patch("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const updatedFields = req.body;
  const users = readUsersFromFile(usersFilePath);
  const index = users.findIndex((u) => u.id === userId);

  const result = checkBasicAuthFromRequest(req);

  if (!result) {
    return res.status(401).send("Unauthorized access");
  }

  if (index !== -1 && updatedFields) {
    users[index] = { ...users[index], ...updatedFields };
    writeUsersToFile(usersFilePath); // Update the users file
    res.status(200).json(users[index]);
  } else {
    res.status(400).json({ message: "Invalid user data or user not found" });
  }
});

// DELETE endpoint to delete user by ID
app.delete("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const users = readUsersFromFile(usersFilePath);
  const index = users.findIndex((u) => u.id === userId);

  const result = checkBasicAuthFromRequest(req);

  if (!result) {
    return res.status(401).send("Unauthorized access");
  }

  if (index !== -1) {
    const deletedUser = users.splice(index, 1);
    writeUsersToFile(usersFilePath); // Update the users file
    res.status(200).json(deletedUser[0]);
  } else {
    res.status(400).json({ message: "User not found" });
  }
});

// AUTHENTICATION

// POST basic authentication via user name and password
app.post("/basic_auth/login", (req, res) => {
  const { username, password } = req.body;
  // Refresh creds
  const users_credentials = getUsersCredentials();

  // Check if username exists
  if (!username || !password) {
    return res.status(400).json({ message: "Bad request " });
  }

  // Check if username exists
  const user = users_credentials.find((user) => user.username === username);
  if (!user) {
    return res.status(401).json({ message: "Invalid username " });
  }

  // Compare passwords
  if (user.password !== password) {
    return res.status(401).json({ message: "Invalid password" });
  }

  login_change(user.username, true);
  return res.status(200).json({ authenticated: true });
});

app.get("/basic_auth/login/:username", (req, res) => {
  const username = req.params.username;
  const users = readUsersFromFile("users_basic_auth.json");
  console.log(users);
  console.log(username);

  // Find the user with the given username
  const user = users.find((u) => u.username === username);

  // Check if username exists
  if (user) {
    res.status(200).json(user);
  } else {
    // If user does not exist
    res.status(404).json({ message: "User not found" });
  }
});

// POST Logout method
app.post("/basic_auth/logout", (req, res) => {
  const { username } = req.body;
  const users_credentials = getUsersCredentials();

  const user = users_credentials.find((user) => user.username === username);
  if (!user) {
    return res.status(400).json({ message: "Bad request" });
  }

  // Update the loggedIn status for the user to false (logout)
  login_change(user.username, false);
  return res.status(200).json({ message: "Logout successful" });
});

app.post("/purchase", (req, res) => {
  const { cipelica, dijamant } = req.body;

  const EnumTypes = {
    CIPELICE: "cipelica",
    DIJAMANT: "dijamant",
  };

  if (cipelica === undefined || dijamant === undefined) {
    res.status(404).send(`Wrong data sent`);
    return;
  }

  if (cipelica && dijamant) {
    res.status(201).send("Successfully added both items");
  } else if (cipelica || dijamant) {
    res.status(201).send("Successfully added one item");
  } else {
    res
      .status(400)
      .send("Purchase not allowed as none of the items is selected");
  }
});

// Start the server
const port = environment === "qa" ? 3002 : 3003;

app.use(cors());

app.listen(port, () => {
  console.log(
    `Server is running on http://localhost:${port} (${environment} environment)`,
  );
});
