#!/bin/bash

# Stash any changes
#git stash

# Pull the latest changes from the repository
#git pull

# Install npm dependencies
npm install

# Run node index.js and send it to the background
node index.js &
bg

# Change directory to ui/client
cd ui/client

# Install npm dependencies in the new directory
npm install

# Start the application
npm start

