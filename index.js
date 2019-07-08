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
    const memory = req.body.conversation.memory;
    const movie = memory.movie;
    const tv = memory.tv;

    // Check for the presence of entities movie or tv
    // If both are present, we prioritize movie
    const kind = movie ? 'movie' : 'tv';

    const genre = memory.genre;
    const genreId = constants.getGenreId(genre.value);

    const language = memory.language;
    const nationality = memory.nationality;

    // Similar to movie and tv, we prioritize language over nationality
    const isoCode = language
      ? language.short.toLowerCase()
      : countryLanguage.getCountryLanguages(nationality.short)[0].iso639_1;

    // Call the moviedb API and return movies as carouselle (see file discoverMovie.js)
    // You can also pass a parameter "datetime", if you collected the #DATETIME entity
    return discoverMovie(kind, genreId, isoCode)
      .then((carouselle) => res.json({
        replies: carouselle,
      }))
      .catch((err) => console.error('movieApi::discoverMovie error: ', err));
  });

app.listen(process.env.PORT || config.PORT, () => console.log(`App started on port ${config.PORT}`));
