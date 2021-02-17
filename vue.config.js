const path = require("path");

module.exports = {
  outputDir: path.resolve(__dirname, "../SuperAdmin-Production/dist"),
  assetsDir: "./",
  chainWebpack: (config) => {
    config.module.rules.delete("eslint");
  },
  devServer: {
    // other config
    port: 8081, // or any other port you wish to use other than 8080
  },
};
