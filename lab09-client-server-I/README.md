# Lab 09: APIs Integration (part I)

The files in this folder are structured as follows:

- server: contains the server-side code, based on the solution of lab 3;
- client: contains the updated client-side code for this lab, based on the solution of lab 8.

In this version of the application:

- The cors package is added to the server to allow requests from the client.
- The full list of movies is retrieved from the server when the page is loaded.
- Every time a filter is applied (including "All"), the filtered list of movies is retrieved from the server.
