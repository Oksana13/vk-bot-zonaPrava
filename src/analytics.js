const ua = require('universal-analytics');
const visitor = ua(process.env.ANALYTICS);

module.exports = {
  analytics(path, title) {
    visitor.pageview(path, path, title, (err) => {
      if (err) {
        console.error(err);
      }
    });
  },

  eventAnalytics(category, value) {
    visitor.event(category, value, (err) => {
      if (err) {
        console.error(err);
      }
    })
  },
};
