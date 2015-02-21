var App = require('components/App/App.js');
var {Route, HashLocation, create} = require('react-router');

var routes = (
  <Route name="app" path="/" handler={App}>
  </Route>
);

var router = create({
  routes: routes,
  location: HashLocation
});

module.exports = router;
