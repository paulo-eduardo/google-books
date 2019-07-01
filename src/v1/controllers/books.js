var request = require("request");

module.exports = {
  index(req, res) {
    request("https://www.googleapis.com/books/v1/volumes?q=react", function(
      error,
      response,
      body
    ) {
      if (error) return res.status(500).json(error);
      return res.status(200).json(JSON.parse(body));
    });
  }
};
