const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const { getUsersCredentials, login_change } = require('./helper');


app.use(bodyParser.json());

// Define the environment
const environment = process.argv[2] || 'qa';
const usersFilePath = path.join(__dirname, `users_${environment}.json`);


// Read user data from the JSON file
let users = [];
try {
  const usersData = fs.readFileSync(usersFilePath, 'utf8');
  users = JSON.parse(usersData);
} catch (error) {
  console.error(`Error reading users file for ${environment} environment:`, error.message);
}

// Function to write user data to the JSON file
function writeUsersToFile() {
  try {
    const usersData = JSON.stringify(users, null, 2);
    fs.writeFileSync(usersFilePath, usersData, 'utf8');
  } catch (error) {
    console.error(`Error writing users file for ${environment} environment:`, error.message);
  }
}

// Function to generate a unique ID for a new user
function generateUniqueId() {
  return users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
}

// GET endpoint to retrieve all users
app.get('/users', (req, res) => {
  try {
    const usersData = fs.readFileSync(usersFilePath, 'utf8');
    const users = JSON.parse(usersData);
    res.status(200).json(users);
  } catch (error) {
    console.error(`Error reading users file for ${environment} environment:`, error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);

  if (!isNaN(userId)) {
    const user = users.find(u => u.id === userId);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } else {
    res.status(400).json({ message: 'Invalid user ID' });
  }
});

// POST endpoint to add a new user
app.post('/users', (req, res) => {
  const { name, age } = req.body;

  if (!name) {
    res.status(400).json({ message: 'Name is required' });
    return;
  }

  const newUser = {
    id: generateUniqueId(),
    name,
    age: age || null,
  };

  users.push(newUser);
  writeUsersToFile(); // Update the users file
  res.status(200).json(newUser);
});

// PUT endpoint to edit user by ID
app.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const updatedUser = req.body;

  const index = users.findIndex(u => u.id === userId);

  if (index !== -1 && updatedUser && updatedUser.name && updatedUser.age) {
    users[index] = { ...users[index], ...updatedUser };
    writeUsersToFile(); // Update the users file
    res.status(200).json(users[index]);
  } else {
    res.status(400).json({ message: 'Invalid user data or user not found' });
  }
});

// PATCH endpoint to update name and/or age for an existing user
app.patch('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const updatedFields = req.body;

  const index = users.findIndex(u => u.id === userId);

  if (index !== -1 && updatedFields) {
    users[index] = { ...users[index], ...updatedFields };
    writeUsersToFile(); // Update the users file
    res.status(200).json(users[index]);
  } else {
    res.status(400).json({ message: 'Invalid user data or user not found' });
  }
});

// DELETE endpoint to delete user by ID
app.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === userId);

  if (index !== -1) {
    const deletedUser = users.splice(index, 1);
    writeUsersToFile(); // Update the users file
    res.status(200).json(deletedUser[0]);
  } else {
    res.status(400).json({ message: 'User not found' });
  }
});


// AUTHENTICATION 

// POST basic authentication via user name and password
app.post('/basic_auth/login', (req, res) => {
  const { username, password } = req.body;
  // Refresh creds
  const users_credentials = getUsersCredentials()

  // Check if username exists
  const user = users_credentials.find(user => user.username === username);
  if (!user) {
    return res.status(400).json({ message: 'Bad request' });
  }

  // Compare passwords
  if (user.password !== password) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  login_change(user.username, true)
  return res.status(200).json({ authenticated: true });
});


// DELETE Logout method
app.delete('/basic_auth/logout', (req, res) => {
  const { username } = req.body;
  const users_credentials = getUsersCredentials()

  const user = users_credentials.find(user => user.username === username);
  if (!user) {
    return res.status(400).json({ message: 'Bad request' });
  }

  // Update the loggedIn status for the user to false (logout)
  login_change(user.username, false)
  return res.status(200).json({ message: 'Logout successful' });
});


// Start the server
const port = environment === 'qa' ? 3002 : 3003;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port} (${environment} environment)`);
});
