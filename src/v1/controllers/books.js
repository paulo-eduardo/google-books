var request = require("request");

module.exports = {
  index(req, res) {
    request("https://www.googleapis.com/books/v1/volumes?q=react", function(
      error,
      response,
      body
    ) {
      if (error) return res.status(500).json(error);
      const library = JSON.parse(body);

      const filterLibrary = library.items.flatMap(x => {
        return {
          id: x.id,
          title: x.volumeInfo.title,
          description: x.volumeInfo.description,
          selfLink: x.selfLink
        };
      });

      return res.status(200).json(filterLibrary);
    });
  },

  storeVote(req, res) {
    const { action } = req.body;
  }
};
