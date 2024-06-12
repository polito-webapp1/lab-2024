# Lab 11: Authentication (with Passport)

In this folder you can find two different pdf documents:

- [lab11-authentication.pdf](https://polito-webapp1.github.io/lab-2024/lab11-authentication/lab11-authentication.pdf) contains the laboratory text.
- [GH-Classroom-Instructions.pdf](https://polito-webapp1.github.io/lab-2024/lab11-authentication/GH-Classroom-Instructions.pdf) contains relavant information about configuring GitHub classroom (useful also for the exam).

## Solution

The files inside `solution` folder are structured as follows:

- server: contains the server-side code, based on the solution of lab 3 and update to support API authentication with Passport.
- client: contains the updated client-side code for this lab, based on the solution of lab 10.

In this version of the application:

- All the APIs requires authentication to be used.
- New APIs to allow users to execute log-in.
- The CORS policy is updated to allow the React application to forward the cookies containg the session ID.
- A new route to manage the log-in process is added in the React Application.
- The client application is updated accordingly to the updated server.

### Registered Users

Here you can find a list of the users already registered inside the provided database.

|         email         |   name   | plain-text password |
|-----------------------|----------|---------------------|
| john.doe@polito.it    | John     | password            |
| mario.rossi@polito.it | Mario    | password            |
| testuser@polito.it    | Testuser | password            |
|-----------------------|----------|---------------------|
