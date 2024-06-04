# Lab 10: APIs Integration (part II)

The files in this folder are structured as follows:

- server: contains the server-side code, based on the solution of lab 3;
- client: contains the updated client-side code for this lab, based on the solution of lab 9.

In this version of the application:

- The cors package is added to the server to allow requests from the client.
- The full list of movies is retrieved from the server when the page is loaded.
- Every time a filter is applied (including "All"), the filtered list of movies is retrieved from the server.
- The user can add new movies.
- The user can edit an existing movie through a dedicated form.
- The user can update some fields of the movie directly from the film library page (i.e., updating the rating and the favorite status).
- The user can delete the movies.
