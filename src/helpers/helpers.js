const axios = require("axios");

const API_KEY = "5143d77625b31a41e3b4f3b08225f48f";
const API_KEY_PART = `?api_key=${API_KEY}`;
const YT_API_KEY = "AIzaSyChVZlGAgi-UtVtxCOhtj6aQIPPDSk2uB8";
const BASE_URL = "https://api.themoviedb.org/3";
const BASE_IMG_URL = "https://image.tmdb.org/t/p/w500";
const BASE_YT_URL = "https://www.youtube.com/watch?v=";
const BASE_YT_API_URL =
  "https://youtube.googleapis.com/youtube/v3/videos?part=id&id=";
const ANONYMOUS_PROFILE_PIC =
  "https://t3.ftcdn.net/jpg/00/57/04/58/360_F_57045887_HHJml6DJVxNBMqMeDqVJ0ZQDnotp5rGD.jpg";
const ANONYMOUS_MOVIE_PIC =
  "https://d32qys9a6wm9no.cloudfront.net/images/movies/poster/500x735.png";
const DEFAULT_PAGE = 1;

const genres = [
  {
    id: 28,
    name: "action",
  },
  {
    id: 12,
    name: "adventure",
  },
  {
    id: 10759,
    name: "action-&-adventure",
  },
  {
    id: 16,
    name: "animation",
  },
  {
    id: 35,
    name: "comedy",
  },
  {
    id: 80,
    name: "crime",
  },
  {
    id: 99,
    name: "documentary",
  },
  {
    id: 18,
    name: "drama",
  },
  {
    id: 10751,
    name: "family",
  },
  {
    id: 14,
    name: "fantasy",
  },
  {
    id: 36,
    name: "history",
  },
  {
    id: 27,
    name: "horror",
  },
  {
    id: 10762,
    name: "kids",
  },
  {
    id: 10402,
    name: "music",
  },
  {
    id: 9648,
    name: "mystery",
  },
  {
    id: 10763,
    name: "news",
  },
  {
    id: 10764,
    name: "reality",
  },
  {
    id: 10749,
    name: "romance",
  },
  {
    id: 878,
    name: "science-fiction",
  },
  {
    id: 10765,
    name: "sci-fi-&-fantasy",
  },
  {
    id: 10766,
    name: "soap",
  },
  {
    id: 10767,
    name: "talk",
  },
  {
    id: 10770,
    name: "tv-movie",
  },
  {
    id: 53,
    name: "thriller",
  },
  {
    id: 10752,
    name: "war",
  },
  {
    id: 10768,
    name: "war-&-politics",
  },
  {
    id: 37,
    name: "western",
  },
];

const getGenreId = (genreName) => {
  const genreId = genres.filter((genre) => genre.name === genreName)[0].id;
  return genreId;
};

const getImgUrl = (actorOrMovie, imagePath) => {
  if (imagePath) {
    return `${BASE_IMG_URL}${imagePath}`;
  } else if (actorOrMovie === "actor") {
    return ANONYMOUS_PROFILE_PIC;
  } else {
    return ANONYMOUS_MOVIE_PIC;
  }
};

const getYtUrl = (ytId) => {
  return `${BASE_YT_URL}${ytId}`;
};

const getUrl = (
  type,
  action = "popular",
  mediaId = null,
  genreId = null,
  query = "",
  ytKey = ""
) => {
  const pagePart = `&page=`;
  const urlType = type === "movies" ? "/movie" : "/tv";
  let url, actionPart;

  switch (action) {
    case "popular":
      actionPart = `${urlType}/popular${API_KEY_PART}${pagePart}`;
      break;
    case "details":
      actionPart = `${urlType}/${mediaId}${API_KEY_PART}${pagePart}`;
      break;
    case "actors":
      actionPart = `${urlType}/${mediaId}/credits${API_KEY_PART}${pagePart}`;
      break;
    case "search":
      actionPart = `/search${urlType}${API_KEY_PART}&query=${query}${pagePart}`;
      break;
    case "providers":
      actionPart = `${urlType}/${mediaId}/watch/providers${API_KEY_PART}`;
      break;
    case "trailer":
      actionPart = `${urlType}/${mediaId}/videos${API_KEY_PART}${pagePart}${DEFAULT_PAGE}`;
      break;
    case "genres":
      actionPart = `/discover${urlType}${API_KEY_PART}&with_genres=${genreId}${pagePart}`;
      break;
    case "may-also-like":
      actionPart = `${urlType}/${mediaId}/similar${API_KEY_PART}${pagePart}`;
      break;
    case "youtube-video":
      actionPart = `${BASE_YT_API_URL}${ytKey}${YT_API_KEY}`;
      break;
    default:
      break;
  }

  url = `${BASE_URL}${actionPart}`;
  return url;
};

const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

const getType = (params) => {
  if (!isEmpty(params)) {
    return params.type === "movies" ? "movies" : "series";
  } else {
    return "movies"; // '/browse' path
  }
};

const getYear = (type, media) => {
  let date;
  if (type === "movies") {
    date = media.release_date ? media.release_date : "2021";
  } else {
    date = media.first_air_date ? media.first_air_date : "2021";
  }

  const dashIndex = date.indexOf("-");
  return date.slice(0, dashIndex);
};

const getCountry = (media) => {
  if (media.production_countries.length > 0) {
    return media.production_countries[0];
  } else {
    return {
      iso_3166_1: "US",
      name: "United States of America",
    };
  }
};

const getTitle = (type, media) => {
  if (type === "movies") {
    return media.title;
  }
  return media.name;
};

const getRuntime = (type, media) => {
  if (type === "movies") {
    return media.runtime;
  }
  if (Array.isArray(media.episode_run_time)) {
    return media.episode_run_time[0];
  }
  return media.episode_run_time;
};

const getGenres = (genresRaw) => {
  return genresRaw.map((genre) => genre.name).slice(0, 4);
};

const removeDuplicates = (arrOfObjects) => {
  const key = "id";
  const arrayUniqueByKey = [
    ...new Map(arrOfObjects.map((item) => [item[key], item])).values(),
  ];
  return arrayUniqueByKey;
};

const fetchFromUrl = async (url) => {
  const res = await axios.get(url);
  return res.data;
};

const fetchMultipleFromUrl = async (url) => {
  return Promise.all([
    fetchFromUrl(`${url}${DEFAULT_PAGE}`, "promise"),
    fetchFromUrl(`${url}2`, "promise"),
    fetchFromUrl(`${url}3`, "promise"),
    fetchFromUrl(`${url}4`, "promise"),
    fetchFromUrl(`${url}5`, "promise"),
  ]);
};

const getMediaArr = (dataArr, type) => {
  const arr = [];
  dataArr.map((data) => {
    data.results.map((media) => {
      const id = media.id;
      const title = type === "movies" ? media.title : media.name;
      const year = getYear(type, media);
      const desc = media.overview;
      const rating = media.vote_average;
      const poster = getImgUrl("movie", media.poster_path);
      const cover = getImgUrl("movie", media.backdrop_path);
      const myType = type;

      const mediaObj = {
        id,
        title,
        desc,
        year,
        rating,
        poster,
        cover,
        type: myType,
      };
      arr.push(mediaObj);
    });
  });

  return removeDuplicates(arr);
};

const getPopularMediaFromAPI = async (type) => {
  const url = `${getUrl(type, "popular")}`;
  const popularMoviesRaw = await fetchMultipleFromUrl(url);
  const popularMovies = getMediaArr(popularMoviesRaw, type);

  return removeDuplicates(popularMovies);
};

const getGenreMediaFromAPI = async (type, genreName) => {
  const genreId = getGenreId(genreName);
  const url = `${getUrl(type, "genres", null, genreId)}`;
  const genreMoviesRaw = await fetchMultipleFromUrl(url);
  const genreMovies = getMediaArr(genreMoviesRaw, type);

  return removeDuplicates(genreMovies);
};

const getQueryMediaFromAPI = async (type, query) => {
  const url = `${getUrl(type, "search", null, null, query)}`;
  const queryMoviesRaw = await fetchMultipleFromUrl(url);
  const queryMovies = getMediaArr(queryMoviesRaw, type);

  return removeDuplicates(queryMovies);
};

const getActorsFromAPI = async (type, mediaId) => {
  const url = `${getUrl(type, "actors", mediaId)}${DEFAULT_PAGE}`;
  const actorsArrRaw = await fetchFromUrl(url, "data");
  const actorsArrRawSliced = actorsArrRaw.cast.slice(0, 6);
  const actors = [];

  actorsArrRawSliced.map((actor) => {
    const actorObj = {
      id: actor.id,
      name: actor.name,
      image: getImgUrl("actor", actor.profile_path),
    };
    actors.push(actorObj);
  });

  return actors;
};

const getDetailsFromAPI = async (type, mediaId) => {
  const url = `${getUrl(type, "details", mediaId)}${DEFAULT_PAGE}`;
  const detailsRaw = await fetchFromUrl(url, "data");
  const mediaType = type;

  const details = {
    id: detailsRaw.id,
    type: mediaType,
    genres: getGenres(detailsRaw.genres),
    website: detailsRaw.homepage,
    title: getTitle(mediaType, detailsRaw),
    desc: detailsRaw.overview,
    runtime: getRuntime(mediaType, detailsRaw),
    rating: detailsRaw.vote_average,
    year: getYear(mediaType, detailsRaw),
    country: getCountry(detailsRaw),
    cover: getImgUrl("movie", detailsRaw.backdrop_path),
    poster: getImgUrl("movie", detailsRaw.poster_path),
  };

  return details;
};

const getProvidersFromAPI = async (type, mediaId) => {
  const url = `${getUrl(type, "providers", mediaId)}`;
  const providersRaw = await fetchFromUrl(url, "data");
  const providersUSARaw = providersRaw.results.US
    ? providersRaw.results.US.flatrate
      ? providersRaw.results.US.flatrate
      : providersRaw.results.US.buy
    : [];

  const providers = [];

  providersUSARaw?.map((provider) => {
    const providerObj = {
      id: provider.provider_id,
      name: provider.provider_name,
      image: getImgUrl("movie", provider.logo_path),
    };
    providers.push(providerObj);
  });

  return providers;
};

const getMayAlsoLikeFromAPI = async (type, mediaId) => {
  const url = `${getUrl(type, "may-also-like", mediaId)}${DEFAULT_PAGE}`;
  const mayAlsoLikeRaw = (await fetchFromUrl(url, "data")).results;
  const mayAlsoLike = [];

  mayAlsoLikeRaw.map((media) => {
    const id = media.id;
    const title = type === "movies" ? media.title : media.name;
    const desc = media.overview;
    const year = getYear(type, media);
    const rating = media.vote_average;
    const poster = getImgUrl("movie", media.poster_path);
    const cover = getImgUrl("movie", media.backdrop_path);
    const myType = type;

    const mediaObj = {
      id,
      title,
      desc,
      year,
      rating,
      poster,
      cover,
      type: myType,
    };
    mayAlsoLike.push(mediaObj);
  });

  return mayAlsoLike;
};

const getTrailerURLFromAPI = async (type, mediaId) => {
  const url = `${getUrl(type, "trailer", mediaId)}`;
  const trailersYtKeysRaw = (await fetchFromUrl(url, "data")).results;

  const trailersAndTeasersYtKeys = trailersYtKeysRaw.filter((tURL) => {
    if (tURL.type === "Trailer") {
      return tURL;
    } else if (tURL.type === "Teaser") {
      return tURL;
    }
  });

  const trailersYtKeys = trailersAndTeasersYtKeys.filter((tURL) => {
    return tURL.type === "Trailer";
  });

  const trailerYtKey =
    trailersYtKeys.length > 0
      ? trailersYtKeys[0].key
      : trailersAndTeasersYtKeys[0].key;

  return trailerYtKey;
};

const getYoutubeVideo = async (youtubeVideoKey) => {
  // const url = `https://youtube.googleapis.com/youtube/v3/videos?part=id&id=${youtubeVideoKey}=${YT_API_KEY}`;
  const url = `https://youtube.googleapis.com/youtube/v3/videos?part=id&id=${youtubeVideoKey}&key=${YT_API_KEY}`;
  const videoRaw = await fetchFromUrl(url, "data");
  console.log("videoRaw:", videoRaw);
  const video = videoRaw.items[0];
  console.log("video:", video);
};

module.exports = {
  isEmpty,
  getType,
  removeDuplicates,
  getMediaArr,
  getPopularMediaFromAPI,
  getGenreMediaFromAPI,
  getQueryMediaFromAPI,
  getActorsFromAPI,
  getDetailsFromAPI,
  getProvidersFromAPI,
  getMayAlsoLikeFromAPI,
  getTrailerURLFromAPI,
};
