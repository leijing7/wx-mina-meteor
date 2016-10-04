var path = require('path')
module.exports = {
  entry: "./entry.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "underscoreAPI.js",
    libraryTarget: "umd",
    library: "underscore"
  },
  module: {
    loaders:[
      { test: require.resolve('./entry.js'),
        loader: "exports?underscore"
      },
      { test: require.resolve("./entry.js"),
        loader: "imports?define=>false"
      }
    ]
  }
};
