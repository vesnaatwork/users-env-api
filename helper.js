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

module.exports = {
  login_change,
  getUsersCredentials
} 
