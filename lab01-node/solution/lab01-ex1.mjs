/* 
 * 01UDFOV Applicazioni Web I / 01TXYOV Web Applications I
 * Lab 1 - Exercise 1 - 2024
 */

import dayjs from "dayjs";


function Film(id, title, isFavorite = false, watchDate = null, rating = 0, userId = 1) {
  this.id = id;
  this.title = title;
  this.favorite = isFavorite;
  this.rating = rating;
  // saved as dayjs object only if watchDate is truthy
  this.watchDate = watchDate && dayjs(watchDate);
  this.userId = userId

  this.toString = () => {
    return `Id: ${this.id}, ` +
    `Title: ${this.title}, Favorite: ${this.favorite}, ` +
    `Watch date: ${this.watchDate}, Score: ${this.rating}, ` +
    `User: ${this.userId}` ;
  }
}

function FilmLibrary() {
  this.list = [];

  this.addNewFilm = (film) => {
    if(!this.list.some(f => f.id == film.id))
      this.list.push(film);
    else
      throw new Error('Duplicated id');
  };

}


function main() {
  // Creating some film entries
  const pulpFiction = new Film(1, "Pulp Fiction", true, "2024-03-10", 5);
  const grams21 = new Film(2, "21 Grams", true, "2024-03-17", 4);
  const starWars = new Film(3, "Star Wars", false);
  const matrix = new Film(4, "Matrix");
  const shrek = new Film(5, "Shrek", false, "2024-03-21", 3);

  // Adding the films to the FilmLibrary
  const library = new FilmLibrary();
  library.addNewFilm(pulpFiction);
  library.addNewFilm(grams21);
  library.addNewFilm(starWars);
  library.addNewFilm(matrix);
  library.addNewFilm(shrek);

  // Print Films
  console.log("***** List of films *****");
  library.list.forEach((item) => console.log(item.toString()));

  // Additional instruction to enable debug 
  debugger;
}

main();
