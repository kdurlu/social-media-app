# SOCIAL MEDIA APPLICATION

## Prerequisites
 - NodeJS
 - MySQL


## Installation

### 1. Clone the project
```
git clone https://github.com/kdurlu/social-media-app
cd social-media-app
```

### 2. Install packages
```
cd client
npm install

cd ..
cd server
npm install
```

### 3. Setup MySQL server
In order to use backend services, you need to setup a MySQL database. After installing and deploying a MySQL server on your local environment, you can run the given queries (`db-queries.sql`) to create tables.

### 4. Environment Variables
Before starting the server, you need to specify environment variables in .env file.

### 5. Start the React development server
```
cd client
npm start
```
### 6. Start the backend NodeJS development server
```
cd server
npx nodemon index.js
```

[Home Page](http://localhost:3000/)

[API](http://localhost:4000/)

## Others

You can deploy your application to production by setting up Nginx for frontend and PM2 for backend services.
