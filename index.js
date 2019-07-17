/**
 * Although gatsby offcial doc said that it'll resolve `main`,
 * but actually always load plugin from `/index.js`, so we must add index.js for it.
 *
 * @see https://www.gatsbyjs.org/docs/files-gatsby-looks-for-in-a-plugin/
 * @see https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby/src/bootstrap/load-plugins/load.js
 */
module.exports = require('./dist/index.js')
