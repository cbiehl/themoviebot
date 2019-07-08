const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config.js');
const constants = require('./constants.js');
const discoverMovie = require('./discoverMovie.js');
const countryLanguage = require('country-language');

const app = express();
app.use(bodyParser.json());

// Conversational AI will send a post request to /errors to notify important errors
// described in a json body
app.post('/errors', (req, res) => {
   console.error(req.body);
   res.sendStatus(200);
});

app.post('/discover-movies', (req, res) => {
    console.log('[POST] /discover-movies');

    // ##################################################################
    // INSERT YOUR CODE HERE

    /*
        Extract the relevant fields from memory and store them in the variables
        kind (movie or tv), genreId and isoCode.

        You can get the genreId by the genre name (e.g. "western") using
        the function: constants.getGenreId(genre.value).
    */

    // END OF YOUR CODE HERE
    // ##################################################################

    // Call the moviedb API and return movies as carouselle (see file discoverMovie.js)
    // You can also pass a parameter "datetime", if you collected the #DATETIME entity
    return discoverMovie(kind, genreId, isoCode)
      .then((carouselle) => res.json({
        replies: carouselle,
      }))
      .catch((err) => console.error('movieApi::discoverMovie error: ', err));
  });

app.listen(process.env.PORT || config.PORT, () => console.log(`App started on port ${config.PORT}`));
