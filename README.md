## Users API

This is a small API which will be used for API workshop related to using environments and environment variables in Postman. The backend is json file. 

In order to run this locally, here are preconditions:

 1. Install brew

    ``/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"``

2. Install node

https://formulae.brew.sh/formula/node


3. Clone the repo

4. cd into project folder

5. ``npm install``

6. ``node index.js qa`` to run on QA environment
7. ``node index.js staging`` to run on staging environment

The server can run on two ports 3002 or 3003, so go to **http://localhost:3002/users** or **http://localhost:3003/users** to test
