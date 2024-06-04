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
    origin: 'http://localhost:5173'
};
app.use(cors(corsOptions));


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

// Custom validation function to check if the user exists
async function validateUserId(req, res, next) {
    const {userId} = req.body;

    try {
        const result = await userDao.getUser(userId);
        if (result.error) {
            res.status(404).json(result).end();
        } else {
            next();
        }
    } catch (err) {
        res.status(503).json({error: err.message}).end();
    }
}


const filmValidation = [
    check('title').isString().notEmpty(),
    check('favorite').isBoolean().optional(),
    check('watchDate').optional({nullable: true}).isISO8601({strict: true}).toDate(),  // valid ISO date, without time
    check('rating').optional({nullable: true}).isInt({min: 1, max: 5}),
    validateUserId
];

/*** Films APIs ***/
// 1. Retrieve the list of all the available films.
// GET /api/films
// This route returns the FilmLibrary. It handles also "filter=?" query parameter
app.get('/api/films',
    (req, res) => {
        // get films that match optional filter in the query
        filmDao.getFilms(req.query.filter)
            // NOTE: "invalid dates" (i.e., missing dates) are set to null during JSON serialization
            .then(films => res.json(films))
            .catch((err) => res.status(500).json(err)); // always return a json and an error message
    }
);

// 2. Retrieve a film, given its "id".
// GET /api/films/<id>
// Given a film id, this route returns the associated film from the library.
app.get('/api/films/:id',
    async (req, res) => {
        try {
            const result = await filmDao.getFilm(req.params.id);
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
app.post('/api/films',
    filmValidation,
    async (req, res) => {
        const invalidFields = validationResult(req);

        if (!invalidFields.isEmpty()) {
            return onValidationErrors(invalidFields, res);
        }

        const favorite = req.body.favorite ? req.body.favorite : false;
        const watchDate = req.body.watchDate ? req.body.watchDate : null;
        const rating = req.body.rating ? req.body.rating : null;
        const film = new Film(undefined, req.body.title, favorite, watchDate, rating, req.body.userId);

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
app.put('/api/films/:id',
    filmValidation,
    async (req, res) => {
        const invalidFields = validationResult(req);

        if (!invalidFields.isEmpty()) {
            return onValidationErrors(invalidFields, res);
        }

        const film = new Film(Number(req.params.id), req.body.title, req.body.favorite, req.body.watchDate, req.body.rating, req.body.userId);

        try {
            const result = await filmDao.updateFilm(film.id, film);
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
app.put('/api/films/:id/favorite',
    [
        check('favorite').isBoolean(),
    ],
    async (req, res) => {
        const invalidFields = validationResult(req);

        if (!invalidFields.isEmpty()) {
            return onValidationErrors(invalidFields, res);
        }

        try {
            const film = await filmDao.getFilm(req.params.id);
            if (film.error)
                return res.status(404).json(film);
            film.favorite = req.body.favorite;  // update favorite property
            const result = await filmDao.updateFilm(film.id, film);
            return res.json(result);
        } catch (err) {
            res.status(503).json({error: `Database error during the favorite update of film ${req.params.id}`});
        }
    }
);

// 6. Update the rating of a specific film
// PUT /api/films/<id>/rating 
// This route changes only the rating value. It could also be a PATCH.
app.put('/api/films/:id/rating',
    [
        check('rating').optional({nullable: true}).isInt({min: 1, max: 5}),
    ],
    async (req, res) => {
        const invalidFields = validationResult(req);

        if (!invalidFields.isEmpty()) {
            return onValidationErrors(invalidFields, res);
        }

        try {
            const film = await filmDao.getFilm(req.params.id);
            if (film.error)
                return res.status(404).json(film);
            // update favorite property
            film.rating = req.body.rating || null;  // if req.body.rating is falsy, null is assigned
            const result = await filmDao.updateFilm(film.id, film);
            return res.json(result);
        } catch (err) {
            res.status(503).json({error: `Database error during the rating update of film ${req.params.id}`});
        }
    }
);


// 7. Delete an existing film, given its “id”
// DELETE /api/films/<id>
// Given a film id, this route deletes the associated film from the library.
app.delete('/api/films/:id',
    async (req, res) => {
        try {
            // NOTE: if there is no film with the specified id, the delete operation is considered successful.
            await filmDao.deleteFilm(req.params.id);
            res.status(200).end();
        } catch (err) {
            res.status(503).json({error: `Database error during the deletion of film ${req.params.id}: ${err} `});
        }
    }
);


// Activating the server
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));
