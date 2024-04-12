const fs = require('fs');

function login_change(username, loggedIn) {
  const users = JSON.parse(fs.readFileSync('users_basic_auth.json', 'utf8'));
  console.log(username)
  const user = users.find(user => user.username === username);

  if (!user) {
    throw new Error('Username not found');
  }

  // Update the loggedIn status for the user
  user.loggedIn = loggedIn;

  fs.writeFileSync('users_basic_auth.json', JSON.stringify(users, null, 2));

  console.log(`Logged in status updated for user ${username}`);
}

// Read the users_basic_auth.json file and return its contents
function getUsersCredentials() {
  try {
    const usersCredentials = JSON.parse(fs.readFileSync('users_basic_auth.json', 'utf8'));
    return usersCredentials;
  } catch (error) {
    console.error('Error reading users_basic_auth.json:', error.message);
    return [];
  }
}

// Function to write user data to the JSON file
function writeUsersToFile(usersFilePath) {
  try {
    const usersData = JSON.stringify(users, null, 2);
    fs.writeFileSync(usersFilePath, usersData, 'utf8');
  } catch (error) {
    console.error(`Error writing users file for ${environment} environment:`, error.message);
  }
}

function readUsersFromFile(usersFilePath) {
try {
  const usersData = fs.readFileSync(usersFilePath, 'utf8');
  users = JSON.parse(usersData);
  return users;
} catch (error) {
  console.error(`Error reading users file for ${environment} environment:`, error.message);
  return error(`Error reading users file for ${environment} environment:`, error.message)
}
}

module.exports = {
  login_change,
  getUsersCredentials,
  writeUsersToFile,
  readUsersFromFile
} 
