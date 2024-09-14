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
  readFromFile,
  writeToFile,
  resetFile,
  deleteLastItem,
  checkCredentials,
  handleError,
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

// Developement test route
app.get("/test", (req, res) => {
  const credentialError = checkCredentials(req);
  if (credentialError) {
    return handleError(res, credentialError);
  }
  res
    .status(200)
    .json({ message: "Authorized access for user: " + user.username });
});

// GET endpoint to retrieve all users
app.get("/users", (req, res) => {
  try {
    const users = readUsersFromFile(usersFilePath);
    if (users instanceof Error) {
      throw users;
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

  const credentialError = checkCredentials(req);
  if (credentialError) {
    return handleError(res, credentialError);
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

  const credentialError = checkCredentials(req);
  if (credentialError) {
    return handleError(res, credentialError);
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

  const credentialError = checkCredentials(req);
  if (credentialError) {
    return handleError(res, credentialError);
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

  const credentialError = checkCredentials(req);
  if (credentialError) {
    return handleError(res, credentialError);
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
app.post("/basic_auth/login", (req, res) => {
  const credentialError = checkCredentials(req);
  if (credentialError) {
    return handleError(res, credentialError);
  }
  res
    .status(200)
    .json({ message: "Authorized access for user: " + user.username });
});

//Get user status
app.get("/basic_auth/login/:username", (req, res) => {
  const credentialError = checkCredentials(req);
  if (credentialError) {
    return handleError(res, credentialError);
  }
  return res
    .status(200)
    .json({ username: user.username, loggedIn: user.loggedIn });
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
    const data = req.body;
    writeToFile(data, "purchase_cart.json");
    res.status(201).send("Successfully added both items");
  } else if (cipelica || dijamant) {
    writeToFile(req.body, "purchase_cart.json");
    res.status(201).send("Successfully added one item");
  } else {
    res
      .status(400)
      .send("Purchase not allowed as none of the items is selected");
  }
});

app.get("/purchase", (req, res) => {
  const data = readFromFile("purchase_cart.json", false, false);
  console.log(data);
  if (data.length > 0) {
    res.status(200).json(data);
  } else {
    res.status(404).json({ message: "There is no requested data" });
  }
});

app.get("/purchase/last", (req, res) => {
  const data = readFromFile("purchase_cart.json", (last = true));
  if (data) {
    res.status(200).json(data);
  } else {
    res
      .status(404)
      .json({ message: "There is no requested datails for last purchase" });
  }
});

app.delete("/purchase", (req, res) => {
  const filePath = "purchase_cart.json";
  try {
    resetFile(filePath);
    res.status(200).send({ message: "Purchases have been reset." });
  } catch (error) {
    res.status(304).send({ message: "Error resetting purchase cart.", error });
  }
});

// DELETE endpoint to delete the last purchase
app.delete("/purchase/last", (req, res) => {
  const filePath = "purchase_cart.json";
  try {
    deleteLastItem(filePath);
    res.status(200).send({ message: "Last purchase has been deleted." });
  } catch (error) {
    res.status(304).send({ message: "Error deleting last purchase.", error });
  }
});

const port = environment === "qa" ? 3002 : 3003;

app.use(cors());

app.listen(port, () => {
  console.log(
    `Server is running on http://localhost:${port} (${environment} environment)`,
  );
});
