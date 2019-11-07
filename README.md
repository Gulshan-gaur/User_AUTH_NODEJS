## Description
# Nodejs User authentication system
# Token-based Authentication

Token-Auth is a Token-based Authentication system. It generates token and stores them in local storage with user informations. It verifies provided token from HTTP Header (Authorization) in order to allow access to protected end point api.


## Installation

Get the sources:
```bash
git clone https://github.com/Gulshan-gaur/User_AUTH_NODEJS.git
```

### NodeJS

In order to start the nodejs server, we need express and node_modules dependencies.

Install the nodejs dependencies:
```bash
home$ npm install
```

Start the server:
```bash
home$ node index.js
```

## Usage

### Generates a token and stores it
```bash
home$ curl http://localhost:3001/signin
```

This send back the generated token for later usage.

### Access protected endpoint
```bash
home$ curl --header 'Authorization: AUTH Generated_Token' http://localhost:3001/protected
```

### Expire a token
```bash
home$ curl --header 'Authorization: AUTH Generated_Token' http://localhost:3001/expire
```


## Stack

* Node.js
* Passport
