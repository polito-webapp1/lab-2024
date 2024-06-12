/*** Importing modules ***/
import express from 'express';
import morgan from 'morgan'; // logging middleware
import cors from 'cors'; // CORS middleware
import {check, validationResult} from 'express-validator'; // validation middleware
import FilmDao from "./dao-films.mjs"; // module for accessing the films table in the DB
import Film from "./Film.mjs";
import UserDao from "./dao-users.mjs";

const filmDao = new FilmDao();
const userDao = new UserDao();

/*** init express and set up the middlewares ***/
const app = express();
app.use(morgan('dev'));
app.use(express.json());


/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
};
app.use(cors(corsOptions));


/*** Passport ***/

/** Authentication-related imports **/
import passport from 'passport';                              // authentication middleware
import LocalStrategy from 'passport-local';                   // authentication strategy (username and password)

/** Set up authentication strategy to search in the DB a user with a matching password.
 * The user object will contain other information extracted by the method userDao.getUserByCredentials() (i.e., id, username, name).
 **/
passport.use(new LocalStrategy(async function verify(username, password, callback) {
    const user = await userDao.getUserByCredentials(username, password)
    if(!user)
      return callback(null, false, 'Incorrect username or password');

    return callback(null, user); // NOTE: user info in the session (all fields returned by userDao.getUserByCredentials(), i.e, id, username, name)
}));

// Serializing in the session the user object given from LocalStrategy(verify).
passport.serializeUser(function (user, callback) { // this user is id + username + name
    callback(null, user);
});

// Starting from the data in the session, we extract the current (logged-in) user.
passport.deserializeUser(function (user, callback) { // this user is id + email + name
    return callback(null, user); // this will be available in req.user

    // In this method, if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
    // e.g.: return userDao.getUserById(id).then(user => callback(null, user)).catch(err => callback(err, null));
});


/** Creating the session */
import session from 'express-session';

app.use(session({
  secret: "This is a very secret information used to initialize the session!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));


/** Defining authentication verification middleware **/
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({error: 'Not authorized'});
}


/*** Utility Functions ***/

// This function is used to handle validation errors
const onValidationErrors = (validationResult, res) => {
    const errors = validationResult.formatWith(errorFormatter);
    return res.status(422).json({validationErrors: errors.mapped()});
};

// Only keep the error message in the response
const errorFormatter = ({msg}) => {
    return msg;
};

const filmValidation = [
    check('title').isString().notEmpty(),
    check('favorite').isBoolean().optional(),
    check('watchDate').optional({nullable: true}).isISO8601({strict: true}).toDate(),  // valid ISO date, without time
    check('rating').optional({nullable: true}).isInt({min: 1, max: 5}),
];


/*** Users APIs ***/

// POST /api/sessions
// This route is used for performing login.
app.post('/api/sessions', function(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err)
        return next(err);
        if (!user) {
          // display wrong login messages
          return res.status(401).json({ error: info});
        }
        // success, perform the login and extablish a login session
        req.login(user, (err) => {
          if (err)
            return next(err);

          // req.user contains the authenticated user, we send all the user info back
          // this is coming from userDao.getUserByCredentials() in LocalStratecy Verify Function
          return res.json(req.user);
        });
    })(req, res, next);
  });

  // GET /api/sessions/current
  // This route checks whether the user is logged in or not.
  app.get('/api/sessions/current', (req, res) => {
    if(req.isAuthenticated()) {
      res.status(200).json(req.user);}
    else
      res.status(401).json({error: 'Not authenticated'});
  });

  // DELETE /api/session/current
  // This route is used for loggin out the current user.
  app.delete('/api/sessions/current', (req, res) => {
    req.logout(() => {
      res.end();
    });
  });


/*** Films APIs ***/
// 1. Retrieve the list of all the available films.
// GET /api/films
// This route returns the FilmLibrary. It handles also "filter=?" query parameter
app.get('/api/films', isLoggedIn,
    (req, res) => {
        // get films that match optional filter in the query
        filmDao.getFilms(req.user.id, req.query.filter)
            // NOTE: "invalid dates" (i.e., missing dates) are set to null during JSON serialization
            .then(films => res.json(films))
            .catch((err) => res.status(500).json(err)); // always return a json and an error message
    }
);

// 2. Retrieve a film, given its "id".
// GET /api/films/<id>
// Given a film id, this route returns the associated film from the library.
app.get('/api/films/:id', isLoggedIn,
    async (req, res) => {
        try {
            const result = await filmDao.getFilm(req.user.id, req.params.id);
            if (result.error)
                res.status(404).json(result);
            else
                // NOTE: "invalid dates" (i.e., missing dates) are set to null during JSON serialization
                res.json(result);
        } catch (err) {
            res.status(500).end();
        }
    }
);


// 3. Create a new film, by providing all relevant information.
// POST /api/films
// This route adds a new film to film library. The film can be created even specifying only its "title".
app.post('/api/films', isLoggedIn,
    filmValidation,
    async (req, res) => {
        const invalidFields = validationResult(req);

        if (!invalidFields.isEmpty()) {
            return onValidationErrors(invalidFields, res);
        }

        const favorite = req.body.favorite ? req.body.favorite : false;
        const watchDate = req.body.watchDate ? req.body.watchDate : null;
        const rating = req.body.rating ? req.body.rating : null;
        const film = new Film(undefined, req.body.title, favorite, watchDate, rating, req.user.id);

        try {
            const result = await filmDao.addFilm(film); // NOTE: addFilm returns the new created object
            res.json(result);
        } catch (err) {
            res.status(503).json({error: `Database error during the creation of new film: ${err}`});
        }
    }
)
;

// 4. Update an existing film, by providing all the relevant information
// PUT /api/films/<id>
// This route allows to modify a film, specifying its id and the necessary data.
app.put('/api/films/:id', isLoggedIn,
    filmValidation,
    async (req, res) => {
        const invalidFields = validationResult(req);

        if (!invalidFields.isEmpty()) {
            return onValidationErrors(invalidFields, res);
        }

        const film = new Film(Number(req.params.id), req.body.title, req.body.favorite, req.body.watchDate, req.body.rating);

        try {
            const result = await filmDao.updateFilm(req.user.id, film.id, film);
            if (result.error)
                res.status(404).json(result);
            else
                res.json(result);
        } catch (err) {
            res.status(503).json({error: `Database error during the update of film ${req.params.id}: ${err}`});
        }
    }
);

// 5. Mark an existing film as favorite/unfavorite
// PUT /api/films/<id>/favorite 
// This route changes only the favorite value. It could also be a PATCH.
app.put('/api/films/:id/favorite', isLoggedIn,
    [
        check('favorite').isBoolean(),
    ],
    async (req, res) => {
        const invalidFields = validationResult(req);

        if (!invalidFields.isEmpty()) {
            return onValidationErrors(invalidFields, res);
        }

        try {
            const film = await filmDao.getFilm(req.user.id, req.params.id);
            if (film.error)
                return res.status(404).json(film);
            film.favorite = req.body.favorite;  // update favorite property
            const result = await filmDao.updateFilm(req.user.id, film.id, film);
            return res.json(result);
        } catch (err) {
            res.status(503).json({error: `Database error during the favorite update of film ${req.params.id}`});
        }
    }
);

// 6. Update the rating of a specific film
// PUT /api/films/<id>/rating 
// This route changes only the rating value. It could also be a PATCH.
app.put('/api/films/:id/rating', isLoggedIn,
    [
        check('rating').optional({nullable: true}).isInt({min: 1, max: 5}),
    ],
    async (req, res) => {
        const invalidFields = validationResult(req);

        if (!invalidFields.isEmpty()) {
            return onValidationErrors(invalidFields, res);
        }

        try {
            const film = await filmDao.getFilm(req.user.id, req.params.id);
            if (film.error)
                return res.status(404).json(film);
            // update favorite property
            film.rating = req.body.rating || null;  // if req.body.rating is falsy, null is assigned
            const result = await filmDao.updateFilm(req.user.id, film.id, film);
            return res.json(result);
        } catch (err) {
            res.status(503).json({error: `Database error during the rating update of film ${req.params.id}`});
        }
    }
);


// 7. Delete an existing film, given its “id”
// DELETE /api/films/<id>
// Given a film id, this route deletes the associated film from the library.
app.delete('/api/films/:id', isLoggedIn,
    async (req, res) => {
        try {
            // NOTE: if there is no film with the specified id, the delete operation is considered successful.
            await filmDao.deleteFilm(req.user.id, req.params.id);
            res.status(200).end();
        } catch (err) {
            res.status(503).json({error: `Database error during the deletion of film ${req.params.id}: ${err} `});
        }
    }
);


// Activating the server
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));
