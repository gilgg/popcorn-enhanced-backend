const express = require("express");
const router = express.Router();
const Media = require("../models/media");
const {
  getPopularMediaFromAPI,
  getGenreMediaFromAPI,
  getQueryMediaFromAPI,
  getDetailsFromAPI,
  getActorsFromAPI,
  getProvidersFromAPI,
  getMayAlsoLikeFromAPI,
  getTrailerURLFromAPI,
} = require("../helpers/helpers");

const MDB_ID = "61ed596e6a1013e8f4b2e726";

router.get("/api/popular/:type", async (req, res) => {
  const arr = await getPopularMediaFromAPI(req.params.type);

  try {
    await Media.findByIdAndUpdate(MDB_ID, {
      totalMedia: arr,
      movies: arr,
      query: "",
    });
    res.send(arr);
  } catch (err) {
    res.status(500).send();
  }
});

router.get("/api/genres/:genreName/:type", async (req, res) => {
  const arr = await getGenreMediaFromAPI(req.params.type, req.params.genreName);

  try {
    await Media.findByIdAndUpdate(MDB_ID, {
      totalMedia: arr,
      movies: arr,
      query: "",
    });
    res.send(arr);
  } catch (err) {
    res.status(500).send();
  }
});

router.get("/api/search/:query/:type", async (req, res) => {
  const arr = await getQueryMediaFromAPI(req.params.type, req.params.query);

  try {
    await Media.findByIdAndUpdate(MDB_ID, {
      totalMedia: arr,
      movies: arr,
      query: req.params.query,
    });
    res.send(arr);
  } catch (err) {
    res.status(500).send();
  }
});

router.get("/api/details/:mediaId/:type", async (req, res) => {
  const details = await getDetailsFromAPI(req.params.type, req.params.mediaId);

  try {
    await Media.findByIdAndUpdate(MDB_ID, {
      query: "",
    });
    res.send(details);
  } catch (err) {
    res.status(500).send();
  }
});

router.get("/api/details", async (req, res) => {
  try {
    res.send({});
  } catch (err) {
    res.status(500).send();
  }
});

router.get("/api/actors/:mediaId/:type", async (req, res) => {
  const actors = await getActorsFromAPI(req.params.type, req.params.mediaId);

  try {
    res.send(actors);
  } catch (err) {
    res.status(500).send();
  }
});

router.get("/api/providers/:mediaId/:type", async (req, res) => {
  const providers = await getProvidersFromAPI(
    req.params.type,
    req.params.mediaId
  );

  try {
    res.send(providers);
  } catch (err) {
    res.status(500).send();
  }
});

router.get("/api/similar/:mediaId/:type", async (req, res) => {
  const similar = await getMayAlsoLikeFromAPI(
    req.params.type,
    req.params.mediaId
  );

  try {
    const curTotalMedia = (await Media.findById(MDB_ID)).totalMedia;
    const newTotalMedia = [...curTotalMedia, ...similar];

    await Media.findByIdAndUpdate(MDB_ID, {
      totalMedia: newTotalMedia,
      similarMedia: similar,
    });
    res.send(similar);
  } catch (err) {
    res.status(500).send();
  }
});

router.get("/api/trailer/:mediaId/:type", async (req, res) => {
  const trailerYTKey = await getTrailerURLFromAPI(
    req.params.type,
    req.params.mediaId
  );

  try {
    res.send(trailerYTKey);
  } catch (err) {
    res.status(500).send();
  }
});

router.get("/api/media", async (req, res) => {
  try {
    const main_obj = await Media.findById(MDB_ID);
    res.send(main_obj);
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = router;
