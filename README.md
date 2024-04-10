## Users API

This is a small API that will be used for an API workshop related to using environments and environment variables in Postman. The backend is json file. 

To run a server locally, here you will find all the prerequisites.

One nit, chances might be you don't have git on your machine, type this

```git --version```

If you see a "Command not found" message, then install git https://git-scm.com/download/mac



 1. If you don't have **brew**, install it (to test if you have it type `brew help` in Terminal. If **brew** is there, you get output. If not, you will see 'command not found')

    ``/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"``

2. Install node if you do not have it

https://formulae.brew.sh/formula/node


3. Clone the repo

4. cd into the project folder

5. ``npm install``

6. in one terminal window ``node index.js qa`` to run on QA environment
7. in another terminal window ``node index.js staging`` to run on staging environment

The server now runs on two ports 3002 or 3003, so go enter in Postman a GET request with **http://localhost:3002/users** or **http://localhost:3003/users** to test
