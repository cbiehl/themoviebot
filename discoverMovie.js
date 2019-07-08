const axios = require('axios');
const config = require('./config.js');

function discoverMovie(kind, genreId, language, datetime) {
  params = {
    api_key: config.MOVIEDB_TOKEN,
    sort_by: 'popularity.desc',
    include_adult: false,
    with_genres: genreId,
    with_original_language: language,
  };

  if(typeof datetime != 'undefined'){
    var date = new Date(datetime.iso);

    params.primary_release_year = date.getUTCFullYear();
  }

  return axios.get(`https://api.themoviedb.org/3/discover/${kind}`, {
    params: params,
  }).then(results => {
    results = results.data.results;
    if (results.length === 0) {
      return [{
        type: 'quickReplies',
        content: {
          title: 'Sorry, but I could not find any results for your request :(',
          buttons: [{ title: 'Start over', value: 'Start over' }],
        },
      }];
    }

    console.log(results);

    const cards = results.slice(0, 10).map(movie => ({
      title: movie.title || movie.name,
      subtitle: movie.overview,
      imageUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      buttons: [
        {
          type: 'web_url',
          value: `https://www.themoviedb.org/movie/${movie.id}`,
          title: 'View More',
        },
      ],
    }));

    return [
      {
        type: 'text',
        content: "Here's what I found for you!",
      },
      { type: 'carousel', content: cards },
    ];
  });
}

module.exports = discoverMovie;
