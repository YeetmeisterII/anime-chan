const { slugGen } = require("../util/slugGen.js");
const {
  matchAnime,
  matchAnimeAndPaginated,
  matchChar,
  defaultFetch,
  pagination,
  radomQuery,
} = require("../util/query");

module.exports.quotes = (req, res) => {
  const { page, anime, char } = req.query;
  const query_count = Boolean(page) + Boolean(anime) + Boolean(char)

  if (Object.keys(req.query).length === 0) {
    defaultFetch().then((db) => {
      res.json(db);
    });
  }

  if (query_count === 1) {
    /**
     * query through anime name
     */
    if (anime) {
      const slug = slugGen(anime);
      matchAnime(slug).then((db) => {
        res.json(db);
      });
    }

    /**
     * query through character name
     */
    if (char) {
      const slug = slugGen(char);
      matchChar(slug).then((db) => {
        res.json(db);
      });
    }

    /**
     * if pagination is not specified return 10 quotes as default
     * (pagination limit is up to 10)
     */
    if (page) {
      if (page <= 10 && page > 0) {
        pagination(page).then((db) => {
          res.json(db);
        });
      } else {
        res.json({
          message: "page request limit is only up to 10!",
          error: true,
        });
      }
    }
  }

  if (query_count === 2){
    /**
     * query through anime name with pagination
     */
    if (anime && page) {
      if (0 < page <= 10) {
        const slug = slugGen(anime);
        matchAnimeAndPaginated(slug, page).then((db) => {
          res.json(db);
        });
      } else {
        res.json({
          message: "page request limit is only up to 10!",
          error: true,
        });
      }
    }
  }
};

module.exports.randomQuote = (req, res) => {
  radomQuery().then((db) => {
    res.json(db);
  });
};
