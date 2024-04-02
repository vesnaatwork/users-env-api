## Users API

This is a small API that will be used for an API workshop related to using environments and environment variables in Postman. The backend is json file. 

To run this locally, here are the preconditions:

 1. If you don't have brew, install it (to test if you have it `brew help`. If brew is there, you get output. If not, you get 'command not found')

    ``/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"``

2. Install node if you dont have it

https://formulae.brew.sh/formula/node


3. Clone the repo

4. cd into project folder

5. ``npm install``

6. ``node index.js qa`` to run on QA environment
7. ``node index.js staging`` to run on staging environment

The server can run on two ports 3002 or 3003, so go to **http://localhost:3002/users** or **http://localhost:3003/users** to test
