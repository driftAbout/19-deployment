># Lab 19: Deployment

[![Build Status](https://travis-ci.org/driftAbout/19-deployment.svg?branch=master)](https://travis-ci.org/driftAbout/19-deployment)

Image Uploads w/ AWS S3 - upload static assets to AWS S3, retrieve a cdn url that contains the previously uploaded static asset and work with secret and public access keys.  A basic express server with basic authorization middleware and get and post routes for basic for signup/signin functionality and a mongodb for persistance.  Bearer authentication is used in conjunction with a JSON web token for keeping users signed in for creating, reading, editing, and deleting galleries.  Photos can be added, requested, and deleted with POST, GET, and DELETE, as well.  Image data is stored in a mongodb and the files are stored on an AWS S# server.  A developer must have an AWS Server Account to set up and use this project.

Users

  - POST -  /api/v1/singup  - Create a user account and save the username, email and a hashed password for hashed encryption comparison. 

  - GET - /api/v1/signin Sign in using a basic authorization header
  
Galleries

  - GET - /api/v1/gallery/:id? get one or fetch all galleries based on user permissions

  - POST - /api/v1/gallery - create new gallery

  - PUT - /api/v1/gallery/:id - update a gallery

  - DELETE - /api/v1/gallery/:id - delete a gallery

Photos

- GET - /api/v1/photo/:id? get one or fetch all photos based on user permissions

- POST - /api/v1/photo - create new photo

- DELETE - /api/v1/photo/:id - delete a photo


>## Install

```BASH
    npm i
```

### Dependencies 

- This project has the following dependencies:

```JSON
   "devDependencies": {
    "debug": "^3.1.0",
    "faker": "^4.1.0",
    "jest": "^22.1.4",
    "superagent": "^3.8.2"
  },
  "dependencies": {
    "bcrypt": "^1.0.3",
    "body-parser": "^1.18.2",
    "cors": "^2.8.4",
    "dotenv": "^5.0.0",
    "express": "^4.16.2",
    "jsonwebtoken": "^8.1.1",
    "mongoose": "^5.0.3"
  }
```

### npm scripts

- The following npm scripts are available:

```JSON
    "scripts": {
    "start": "node index.js",
    "start:watch": "nodemon index.js",
    "start:debug": "DEBUG=http* nodemon index.js",
    "test": "jest -i",
    "test:watch": "jest -i --watchAll",
    "test:debug": "DEBUG=http* jest -i",
    "lint": "eslint .",
    "start-db": "mkdir -p ./data/db && mongod --dbpath ./data/db",
    "stop-db": "killall mongod"
  }
```

#### Run the tests!

Normal mode

```BASH
    npm test
```

Debug mode

```BASH
    npm run test:debug
```

#### Start the server

Start

```BASH
    npm start
```

Debug mode

```BASH
    npm run start:debug
```


#### Start the database

Start

```BASH
    npm run start-db
```


>## Usage

### USERS

### Post

  - Create a new user by sending a POST request to /api/v1/signup 
  
  - send a body that contains a 'username', 'email' and 'password'

  - The response will contain a JSON web token..


```BASH
    http POST :3000/api/v1/signup username='Kevin Miller' email='me@you.com' password='misslabeled'
    HTTP/1.1 201 Created
    Access-Control-Allow-Origin: *
    Connection: keep-alive
    Content-Length: 205
    Content-Type: application/json; charset=utf-8
    Date: Mon, 12 Feb 2018 05:16:33 GMT
    ETag: W/"cd-GZEW9jHgiFNUv954fKKC2G/qcPU"
    X-Powered-By: Express

    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3QiOiIxOGQ0OTgxNTE4NmFiNDNmYzRmOWY3MDIyMGY0NjAxOTQ4OThjYjdhNjMwMWMxNjE3ZWU0NTgyMGFmYzQ5NjFlIiwiaWF0IjoxNTE4NDEyNTkzfQ._RUwIlfPOjl0XNs-WCW-bt8RN_GyGtfoVFzIFqIWwls"
```

### GET 

  - Make a get request with a basic auth header to /api/v1/signin 
  
  - The response will contain a JSON web token.

```BASH
    http -a 'Kevin Miller:misslabeled' :3000/api/v1/signin
    HTTP/1.1 200 OK
    Access-Control-Allow-Origin: *
    Connection: keep-alive
    Content-Length: 205
    Content-Type: application/json; charset=utf-8
    Date: Mon, 12 Feb 2018 05:21:50 GMT
    ETag: W/"cd-dILWxnUJXOWdWR8VY0MV2rZLzwI"
    X-Powered-By: Express

    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3QiOiIyYjdhNDI1OWMzOTU0NmQyOTE3MjBlYzljYzJlZjA4YjBhMTYwOTY0MmY5YzFmMGM5OGViOTI3MWNiOWQzOWMzIiwiaWF0IjoxNTE4NDEyOTEwfQ.m12eAlQwPTYugoq9OkQogvzhujZfg-y4pqgy3R3EmHY"

```

### GALLERY

  - POST - /api/v1/gallery - create new gallery

    - Post with tile and description

    - Use the the JSON web toke from the signin as the Authorization Header 

```BASH
    http POST :3000/api/v1/gallery title='Midnight' description='Homework time' 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3QiOiI3YTk1ZmYxZjg2ZTYxYzA1OWQ4Mjg3ZDBiZGQ1MGMzMDVkOGU3OWY0ZmMxNmM2YmZhZWRmMTAzYzM5NWY5M2ZhIiwiaWF0IjoxNTE4NDE1Mzc3fQ.ScOWVMFZv6QA5JlBMyv0yA48p92Kj04PPRHqr6FE73w'
    HTTP/1.1 201 Created
    Access-Control-Allow-Origin: *
    Connection: keep-alive
    Content-Length: 206
    Content-Type: application/json; charset=utf-8
    Date: Mon, 12 Feb 2018 06:20:05 GMT
    ETag: W/"ce-hPbxSdXCfuxzeo0z6BezZuFB5cE"
    X-Powered-By: Express

    {
        "__v": 0,
        "_id": "5a81321591251c0fafb5b1cd",
        "createdAt": "2018-02-12T06:20:05.467Z",
        "description": "Homework time",
        "title": "Midnight",
        "updatedAt": "2018-02-12T06:20:05.467Z",
        "user_id": "5a812e1191251c0fafb5b1cb"
    }
```
  
  - GET - /api/v1/gallery/:id? get one or fetch all galleries based on user permissions

```BASH
    http :3000/api/v1/gallery/5a81354e9fbdaf133e24893a 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3QiOiI3YTk1ZmYxZjg2ZTYxYzA1OWQ4Mjg3ZDBiZGQ1MGMzMDVkOGU3OWY0ZmMxNmM2YmZhZWRmMTAzYzM5NWY5M2ZhIiwiaWF0IjoxNTE4NDE1Mzc3fQ.ScOWVMFZv6QA5JlBMyv0yA48p92Kj04PPRHqr6FE73w'
    HTTP/1.1 200 OK
    Access-Control-Allow-Origin: *
    Connection: keep-alive
    Content-Length: 206
    Content-Type: application/json; charset=utf-8
    Date: Mon, 12 Feb 2018 06:34:59 GMT
    ETag: W/"ce-X+t6Y0WcqDZ83+fBLw7PIJbsFl4"
    X-Powered-By: Express

    {
        "__v": 0,
        "_id": "5a81354e9fbdaf133e24893a",
        "createdAt": "2018-02-12T06:33:50.092Z",
        "description": "Homework time",
        "title": "Midnight",
        "updatedAt": "2018-02-12T06:33:50.092Z",
        "user_id": "5a812e1191251c0fafb5b1cb"
    }
```

- GET - /api/v1/gallery fetch all gallery ids for the signed in user

```BASH
    http  :3000/api/v1/gallery 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3QiOiI3YTk1ZmYxZjg2ZTYxYzA1OWQ4Mjg3ZDBiZGQ1MGMzMDVkOGU3OWY0ZmMxNmM2YmZhZWRmMTAzYzM5NWY5M2ZhIiwiaWF0IjoxNTE4NDE1Mzc3fQ.ScOWVMFZv6QA5JlBMyv0yA48p92Kj04PPRHqr6FE73w'
    HTTP/1.1 200 OK
    Access-Control-Allow-Origin: *
    Connection: keep-alive
    Content-Length: 55
    Content-Type: application/json; charset=utf-8
    Date: Mon, 12 Feb 2018 06:37:59 GMT
    ETag: W/"37-PovEP7gQdDoV5SEWwKbGcnaX0xw"
    X-Powered-By: Express

    [
        "5a81350e9fbdaf133e248939",
        "5a81354e9fbdaf133e24893a"
    ]
```

  - PUT - /api/v1/gallery/:id - update a gallery

```BASH
    http POST :3000/api/v1/gallery title='Sunrise' description='Sleepy time' 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3QiOiI3YTk1ZmYxZjg2ZTYxYzA1OWQ4Mjg3ZDBiZGQ1MGMzMDVkOGU3OWY0ZmMxNmM2YmZhZWRmMTAzYzM5NWY5M2ZhIiwiaWF0IjoxNTE4NDE1Mzc3fQ.ScOWVMFZv6QA5JlBMyv0yA48p92Kj04PPRHqr6FE73w'
    HTTP/1.1 201 Created
    Access-Control-Allow-Origin: *
    Connection: keep-alive
    Content-Length: 203
    Content-Type: application/json; charset=utf-8
    Date: Mon, 12 Feb 2018 06:32:46 GMT
    ETag: W/"cb-d9EMnJ8EIpCDeutjoTQr4aQ4rKI"
    X-Powered-By: Express

    {
        "__v": 0,
        "_id": "5a81350e9fbdaf133e248939",
        "createdAt": "2018-02-12T06:32:46.324Z",
        "description": "Sleepy time",
        "title": "Sunrise",
        "updatedAt": "2018-02-12T06:32:46.324Z",
        "user_id": "5a812e1191251c0fafb5b1cb"
    }


    http PUT :3000/api/v1/gallery/5a81350e9fbdaf133e248939 title='Sunset' 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3QiOiI3YTk1ZmYxZjg2ZTYxYzA1OWQ4Mjg3ZDBiZGQ1MGMzMDVkOGU3OWY0ZmMxNmM2YmZhZWRmMTAzYzM5NWY5M2ZhIiwiaWF0IjoxNTE4NDE1Mzc3fQ.ScOWVMFZv6QA5JlBMyv0yA48p92Kj04PPRHqr6FE73w'
    HTTP/1.1 204 No Content
    Access-Control-Allow-Origin: *
    Connection: keep-alive
    Date: Mon, 12 Feb 2018 06:40:56 GMT
    ETag: W/"a-bAsFyilMr4Ra1hIU5PyoyFRunpI"
    X-Powered-By: Express

    http :3000/api/v1/gallery/5a81350e9fbdaf133e248939 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3QiOiI3YTk1ZmYxZjg2ZTYxYzA1OWQ4Mjg3ZDBiZGQ1MGMzMDVkOGU3OWY0ZmMxNmM2YmZhZWRmMTAzYzM5NWY5M2ZhIiwiaWF0IjoxNTE4NDE1Mzc3fQ.ScOWVMFZv6QA5JlBMyv0yA48p92Kj04PPRHqr6FE73w'
    HTTP/1.1 200 OK
    Access-Control-Allow-Origin: *
    Connection: keep-alive
    Content-Length: 202
    Content-Type: application/json; charset=utf-8
    Date: Mon, 12 Feb 2018 06:43:09 GMT
    ETag: W/"ca-cdxfGj3gG31P5HNEG4R/Rcum8fA"
    X-Powered-By: Express

    {
        "__v": 0,
        "_id": "5a81350e9fbdaf133e248939",
        "createdAt": "2018-02-12T06:32:46.324Z",
        "description": "Sleepy time",
        "title": "Sunset",
        "updatedAt": "2018-02-12T06:40:56.534Z",
        "user_id": "5a812e1191251c0fafb5b1cb"
    }
```

  - DELETE - /api/v1/gallery/:id - delete a gallery

   - Delete a gallery created by the user 

```BASH
    http DELETE :3000/api/v1/gallery/5a81350e9fbdaf133e248939 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3QiOiI3YTk1ZmYxZjg2ZTYxYzA1OWQ4Mjg3ZDBiZGQ1MGMzMDVkOGU3OWY0ZmMxNmM2YmZhZWRmMTAzYzM5NWY5M2ZhIiwiaWF0IjoxNTE4NDE1Mzc3fQ.ScOWVMFZv6QA5JlBMyv0yA48p92Kj04PPRHqr6FE73w'
    HTTP/1.1 204 No Content
    Access-Control-Allow-Origin: *
    Connection: keep-alive
    Date: Mon, 12 Feb 2018 06:48:02 GMT
    ETag: W/"a-bAsFyilMr4Ra1hIU5PyoyFRunpI"
    X-Powered-By: Express

    http :3000/api/v1/gallery/5a81350e9fbdaf133e248939 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3QiOiI3YTk1ZmYxZjg2ZTYxYzA1OWQ4Mjg3ZDBiZGQ1MGMzMDVkOGU3OWY0ZmMxNmM2YmZhZWRmMTAzYzM5NWY5M2ZhIiwiaWF0IjoxNTE4NDE1Mzc3fQ.ScOWVMFZv6QA5JlBMyv0yA48p92Kj04PPRHqr6FE73w'
    HTTP/1.1 404 Not Found
    Access-Control-Allow-Origin: *
    Connection: keep-alive
    Content-Length: 30
    Content-Type: text/html; charset=utf-8
    Date: Mon, 12 Feb 2018 06:48:30 GMT
    ETag: W/"1e-2ypalmQPo1HDYb088GllK7PpoEU"
    X-Powered-By: Express

    Error: Error ENOENT: Not Found
```
### PHOTO

- POST - /api/v1/photo 

  - create new photo associated with a gallery

```BASH

    lab-kevin git:(master) ✗ => http -f POST :3000/api/v1/photo name='Midnight Madness' description='Crazies at night' gallery_id='5a813e92ad60df1e48e713da' image@'/__test__/temp/1ca59e6e-36b8-4ceb-85d4-32da036e8dba.jpg' 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3QiOiIzNTgwNTNlZGE3NWRlYzNlMmY5NjljOGUxN2IyZjkwOWVkODRhNWJlYzgyMDM3NzJhZDllYWUxZWFlM2JlYzdmIiwiaWF0IjoxNTE4NDE5NDI1fQ.1b4smow0gZQk_ttcnatI4Wz0Nve2tWdwRmhxyh_5RDg'
    HTTP/1.1 201 Created
    Access-Control-Allow-Origin: *
    Connection: keep-alive
    Content-Length: 393
    Content-Type: application/json; charset=utf-8
    Date: Mon, 12 Feb 2018 07:21:16 GMT
    ETag: W/"189-7f4Elk0TlwmimRhhigrBTkg6rjM"
    X-Powered-By: Express

    {
        "__v": 0,
        "_id": "5a81406cad60df1e48e713dc",
        "cloud_key": "922ac884d882c52037414c4d8fd90a8f.jpg",
        "createdAt": "2018-02-12T07:21:16.790Z",
        "description": "Crazies at night",
        "gallery_id": "5a813e92ad60df1e48e713da",
        "image_url": "https://401d21-18.s3.amazonaws.com/922ac884d882c52037414c4d8fd90a8f.jpg",
        "name": "Midnight Madness",
        "updatedAt": "2018-02-12T07:21:16.790Z",
        "user_id": "5a813de1ad60df1e48e713d9"
    }
```

- GET - /api/v1/photo/:id? 

  - Request one photo associated with the user's permissions

  ```BASH
    http :3000/api/v1/photo/5a81406cad60df1e48e713dc 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3QiOiIzNTgwNTNlZGE3NWRlYzNlMmY5NjljOGUxN2IyZjkwOWVkODRhNWJlYzgyMDM3NzJhZDllYWUxZWFlM2JlYzdmIiwiaWF0IjoxNTE4NDE5NDI1fQ.1b4smow0gZQk_ttcnatI4Wz0Nve2tWdwRmhxyh_5RDg'
    HTTP/1.1 200 OK
    Access-Control-Allow-Origin: *
    Connection: keep-alive
    Content-Length: 393
    Content-Type: application/json; charset=utf-8
    Date: Mon, 12 Feb 2018 07:26:06 GMT
    ETag: W/"189-7f4Elk0TlwmimRhhigrBTkg6rjM"
    X-Powered-By: Express

    {
        "__v": 0,
        "_id": "5a81406cad60df1e48e713dc",
        "cloud_key": "922ac884d882c52037414c4d8fd90a8f.jpg",
        "createdAt": "2018-02-12T07:21:16.790Z",
        "description": "Crazies at night",
        "gallery_id": "5a813e92ad60df1e48e713da",
        "image_url": "https://401d21-18.s3.amazonaws.com/922ac884d882c52037414c4d8fd90a8f.jpg",
        "name": "Midnight Madness",
        "updatedAt": "2018-02-12T07:21:16.790Z",
        "user_id": "5a813de1ad60df1e48e713d9"
    }
  ```

- GET - /api/v1/photo

  - Request all photo associated with the user's permissions

```BASH
    http :3000/api/v1/photo/ 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3QiOiIzNTgwNTNlZGE3NWRlYzNlMmY5NjljOGUxN2IyZjkwOWVkODRhNWJlYzgyMDM3NzJhZDllYWUxZWFlM2JlYzdmIiwiaWF0IjoxNTE4NDE5NDI1fQ.1b4smow0gZQk_ttcnatI4Wz0Nve2tWdwRmhxyh_5RDg'
    HTTP/1.1 200 OK
    Access-Control-Allow-Origin: *
    Connection: keep-alive
    Content-Length: 28
    Content-Type: application/json; charset=utf-8
    Date: Mon, 12 Feb 2018 07:27:46 GMT
    ETag: W/"1c-Z8a26hcfHjGhffdjUiygqrMUAyU"
    X-Powered-By: Express

    [
        "5a81406cad60df1e48e713dc",
        "5a81406cad60df1e48e718rw",
        "5a81406cad60df1e48e845ef"
    ]
```


- DELETE - /api/v1/photo/:id 

  - Remove a photo

  ```BASH
    http DELETE :3000/api/v1/photo/5a81406cad60df1e48e713dc 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3QiOiIzNTgwNTNlZGE3NWRlYzNlMmY5NjljOGUxN2IyZjkwOWVkODRhNWJlYzgyMDM3NzJhZDllYWUxZWFlM2JlYzdmIiwiaWF0IjoxNTE4NDE5NDI1fQ.1b4smow0gZQk_ttcnatI4Wz0Nve2tWdwRmhxyh_5RDg'
    HTTP/1.1 204 No Content
    Access-Control-Allow-Origin: *
    Connection: keep-alive
    Date: Mon, 12 Feb 2018 07:34:10 GMT
    ETag: W/"a-bAsFyilMr4Ra1hIU5PyoyFRunpI"
    X-Powered-By: Express

    http :3000/api/v1/photo/5a81406cad60df1e48e713dc 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3QiOiIzNTgwNTNlZGE3NWRlYzNlMmY5NjljOGUxN2IyZjkwOWVkODRhNWJlYzgyMDM3NzJhZDllYWUxZWFlM2JlYzdmIiwiaWF0IjoxNTE4NDE5NDI1fQ.1b4smow0gZQk_ttcnatI4Wz0Nve2tWdwRmhxyh_5RDg'
    HTTP/1.1 404 Not Found
    Access-Control-Allow-Origin: *
    Connection: keep-alive
    Content-Length: 30
    Content-Type: text/html; charset=utf-8
    Date: Mon, 12 Feb 2018 07:38:11 GMT
    ETag: W/"1e-2ypalmQPo1HDYb088GllK7PpoEU"
    X-Powered-By: Express

    Error: Error ENOENT: Not Found
  ```