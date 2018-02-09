># Lab 11: Express

This is a simple  HTTP server created using express.  There are four basic CRUD methods available for interacting with an object with three properties, subject, comment and id. 

  - POST - Create an object and have it saved to a file. 

  - PUT - modify the subject and comment properties.

  - GET - Fetch teh data for an object.

  - DELETE - remove an object fro storage. 

  The objects are stored in files on the server as json.

>## Install

```BASH
    npm i
```

### Dependencies 

- This project has the following dependencies:

```JSON
    "devDependencies": {
        "debug": "^3.1.0",
        "dotenv": "^5.0.0",
        "eslint": "^4.16.0",
        "jest": "^22.1.4",
        "superagent": "^3.8.2"
      },
      "dependencies": {
        "bluebird": "^3.5.1",
        "body-parser": "^1.18.2",
        "express": "^4.16.2",
        "uuid": "^3.2.1"
      }
```

### npm scripts

- The following npm scripts are available:

```JSON
    "scripts": {
      "lint": "eslint .",
      "test": "jest --verbose -i",
      "test:debug": "DEBUG=http* jest --verbose -i",
      "start": "nodemon index.js",
      "start:debug": "DEBUG=http* nodemon index.js"
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

>## Usage

### Post

  - Create a new note by sending a request to /api/v1/note with a body that contains a 'subject' and 'comment'.

  - The response will contain a json copy of the object with its unique identifier.

```JAVASCRIPT
{subject: 'talking computers', comment: 'I don\'t like them'}

```

```BASH
 http POST :4000/api/v1/note subject="talking computers" comment="I don't like them"

    HTTP/1.1 201 Created
    Connection: keep-alive
    Content-Length: 107
    Content-Type: application/json; charset=utf-8
    Date: Tue, 30 Jan 2018 08:09:06 GMT
    ETag: W/"6b-8CtRPZUH1itf2mPj1CjrgP2Py1Y"
    X-Powered-By: Express

    {
        "comment": "I don't like them",
        "id": "0171fde2-929b-4c67-a882-35e11fccc4fb",
        "subject": "talking computers"
    }
```

### GET - fetch one note

  - Get a json object of a note by sending its unique id as a path to /api/v1/note/&lt;unique_id&gt;

```BASH
    http :4000/api/v1/note/0171fde2-929b-4c67-a882-35e11fccc4fb
    HTTP/1.1 200 OK
    Connection: keep-alive
    Content-Length: 107
    Content-Type: application/json; charset=utf-8
    Date: Tue, 30 Jan 2018 08:14:46 GMT
    ETag: W/"6b-8CtRPZUH1itf2mPj1CjrgP2Py1Y"
    X-Powered-By: Express

    {
        "comment": "I don't like them",
        "id": "0171fde2-929b-4c67-a882-35e11fccc4fb",
        "subject": "talking computers"
    }

```


### GET - fetch all ids

- Get a json array of all note ids by sending a GET request to /api/v1/note

```BASH
      http :4000/api/v1/note
      HTTP/1.1 200 OK
      Connection: keep-alive
      Content-Length: 118
      Content-Type: application/json; charset=utf-8
      Date: Tue, 30 Jan 2018 08:18:30 GMT
      ETag: W/"76-RO+qkcrAr3t6PEDzQQXujTYQdGw"
      X-Powered-By: Express

      [
          "0171fde2-929b-4c67-a882-35e11fccc4fb",
          "7370a48e-9546-4f05-92fb-6328fdc27afa",
          "f2658693-3cbb-4aab-90ca-3ae7de04de02"
      ]

```

### PUT - update a note

  - Use the unique id to update a note along with a subject and comment in the request body with a PUT request to /api/v1/note

```Bash
    http POST :4000/api/v1/note subject="Helo" comment="How is you?"
    HTTP/1.1 201 Created
    Connection: keep-alive
    Content-Length: 86
    Content-Type: application/json; charset=utf-8
    Date: Tue, 30 Jan 2018 08:23:17 GMT
    ETag: W/"56-NbKFB0DGFQ4LrE5HRKXuk09Ueu0"
    X-Powered-By: Express

    {
        "comment": "How is you?",
        "id": "201d5149-7736-42e1-a349-b6f3e641e735",
        "subject": "Helo"
    }

    --------------------

    http PUT :4000/api/v1/note/201d5149-7736-42e1-a349-b6f3e641e735 subject="Hello" comment="How are you?"
    HTTP/1.1 204 No Content
    Connection: keep-alive
    Date: Tue, 30 Jan 2018 08:24:40 GMT
    X-Powered-By: Express

    ---------------------

    http :4000/api/v1/note/201d5149-7736-42e1-a349-b6f3e641e735
    HTTP/1.1 200 OK
    Connection: keep-alive
    Content-Length: 88
    Content-Type: application/json; charset=utf-8
    Date: Tue, 30 Jan 2018 08:25:27 GMT
    ETag: W/"58-bETguzT0FCDFcQ95/XZ/XsWno3Y"
    X-Powered-By: Express

    {
        "comment": "How are you?",
        "id": "201d5149-7736-42e1-a349-b6f3e641e735",
        "subject": "Hello"
    }
```

### Delete

- Delete a note from storage by making a DELETE request with a unique id of a note to /api/v1/note

```BASH
    http DELETE :4000/api/v1/note/201d5149-7736-42e1-a349-b6f3e641e735
    HTTP/1.1 204 No Content
    Connection: keep-alive
    Date: Tue, 30 Jan 2018 08:28:47 GMT
    X-Powered-By: Express
```

- A Get request with this id will now return an error 404.

```BASH
     http :4000/api/v1/note/201d5149-7736-42e1-a349-b6f3e641e735
    HTTP/1.1 404 Not Found
    Connection: keep-alive
    Content-Length: 167
    Content-Type: text/html; charset=utf-8
    Date: Tue, 30 Jan 2018 08:30:12 GMT
    ETag: W/"a7-vi2fSZmlczG1C4XL6S5hY+V1M+k"
    X-Powered-By: Express

    Error: ENOENT: no such file or directory, open '../data/note/201d5149-7736-42e1-a349-b6f3e641e735.json'
```

