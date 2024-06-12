# Lab 11 - Express Server with authentication

This folder contains an extended version of the proposed solution for the third laboratory of the courses. Specifically, the APIs offered by this server are available only after that user authincates themselves.

This README includes an overview of the files contained in the folder and a description of each API offered by the server.

## File overview

- `server.mjs`: the main file of the server. It defines all the API endpoints and behavior. It interacts with the database and returns to the client the desired data.
- `db.mjs`: it opens the database. It has to be imported (e.g., by `dao-film.mjs`) to interact with the db.
- `dao-films.mjs`: it contains all the method for interacting with the database (specifically, to interact with the `film` table).
- `dao-users.mjs`: it contains two methods for interacting with the database (specifically, to interact with the `user` table).
- `films.mjs`: the same data model for Film objects used in the previous labs.
- `test-api.http`: this file can be used for testing the API with a dedicated Visual Studio Code extension (it contains also the new authentication APIs calls).

## Registered Users

Here you can find a list of the users already registered inside the provided database.

|         email         |   name   | plain-text password |
|-----------------------|----------|---------------------|
| john.doe@polito.it    | John     | password            |
| mario.rossi@polito.it | Mario    | password            |
| testuser@polito.it    | Testuser | password            |
|-----------------------|----------|---------------------|

## List of APIs offered by the server

### User Authentication Management

#### Login

- HTTP method: `POST`  URL: `/api/sessions`
- Description: authenticate the user who is trying to login
- Request body: credentials of the user who is trying to login

``` JSON
{
    "username": "username",
    "password": "password"
}
```

- Response: `200 OK` (success)
- Response body: authenticated user

``` JSON
{
    "id": 1,
    "username": "john.doe@polito.it", 
    "name": "John"
}
```

- Error responses:  `500 Internal Server Error` (generic error), `401 Unauthorized User` (login failed)

#### Check if user is logged in

- HTTP method: `GET`  URL: `/api/sessions/current`
- Description: check if current user is logged in and get her data
- Request body: _None_
- Response: `200 OK` (success)

- Response body: authenticated user

``` JSON
{
    "id": 1,
    "username": "john.doe@polito.it", 
    "name": "John"
}
```

- Error responses: `500 Internal Server Error` (generic error), `401 Unauthorized User` (user is not logged in)

#### Logout

- HTTP method: `DELETE`  URL: `/api/sessions/current`
- Description: logout current user
- Request body: _None_
- Response: `200 OK` (success)

- Response body: _None_

- Error responses: `500 Internal Server Error` (generic error), `401 Unauthorized User` (user is not logged in)

### Film Management

#### Get all films

HTTP method: `GET`  URL: `/api/films`

- Description: Get the full list of films or the films that match the query filter parameter
- Request body: _None_
- Request query parameter: _filter_ name of the filter to apply (filter-all, filter-favorite, filter-best, filter-lastmonth, filter-unseen)
- Response: `200 OK` (success)
- Response body: Array of objects, each describing one film:

  ``` json
  [
    {
      "id": 1,
      "title": "Pulp Fiction",
      "favorite": true,
      "watchDate": "2023-03-11",
      "rating": 5,
      "userId": 1
    },
    {
      "id": 2,
      "title": "21 Grams",
      "favorite": true,
      "watchDate": "2023-03-17",
      "rating": 4,
      "userId": 1
    },
    ...
  ]
  ```

- Error responses:  `500 Internal Server Error` (generic error)

#### Get film by id

HTTP method: `GET`  URL: `/api/films/:id`

- Description: Get the film corresponding to the id
- Request body: _None_
- Response: `200 OK` (success)
- Response body: One object describing the required film:

  ``` JSON
  [
    {
      "id": 2,
      "title": "21 Grams",
      "favorite": true,
      "watchDate": "2023-03-17",
      "rating": 4,
      "userId": 1
    }
  ]
  ```

- Error responses:  `500 Internal Server Error` (generic error), `404 Not Found` (not present or unavailable)

#### Add a new film

HTTP method: `POST`  URL: `/api/films`

- Description: Add a new film to the films of a specified user
- Request body: description of the object to add

  ``` JSON
  {
      "title": "21 Grams",
      "favorite": true,
      "watchDate": "2023-03-17",
      "rating": 4,
      "userId": 1
  }
  ```

- Response: `200 OK` (success)
- Response body: the entire representation of the newly-added film

- Error responses: `404 Not Found` (not present or unavailable), `422 Unprocessable Entity` (invalid input), `503 Service Unavailable` (database error)

#### Update an existing film

HTTP method: `PUT`  URL: `/api/films/:id`

- Description: Update values of an existing film, except the id
- Request body: description of the object to update

  ``` JSON
  {
      "title": "The Matrix",
      "favorite": true,
      "watchDate": "2023-03-31",
      "rating": 5,
      "userId": 1
  }
  ```

- Response: `200 OK` (success)
- Response body: the entire representation of the newly-added film

- Error responses: `404 Not Found` (not present or unavailable), `422 Unprocessable Entity` (invalid input), `503 Service Unavailable` (database error)

#### Delete an existing film

HTTP method: `DELETE`  URL: `/api/films/:id`

- Description: Delete an existing film
- Request body: _None_

- Response: `200 OK` (success)
- Response body: _None_

- Error responses:  `404 Not Found` (not present or unavailable), `503 Service Unavailable` (database error)

#### Update whether a film is favorite

HTTP method: `PUT`  URL: `/api/films/:id/favorite`

- Description: Update favorite value of an existing film
- Request body: value of the favorite property

  ``` JSON
  {
      "favorite": true,
  }
  ```

- Response: `200 OK` (success)
- Response body: the object as represented in the database

- Error responses: `404 Not Found` (not present or unavailable), `422 Unprocessable Entity` (invalid input), `503 Service Unavailable` (database error)

#### Update the rating of an existing film

HTTP method: `PUT`  URL: `/api/films/:id/rating`

- Description: Update the rating of an existing film
- Request body: value of the rating property

  ``` JSON
  {
      "rating": 5,
  }
  ```

- Response: `200 OK` (success)
- Response body: the object as represented in the database

- Error responses: `404 Not Found` (not present or unavailable), `422 Unprocessable Entity` (invalid input), `503 Service Unavailable` (database error)
