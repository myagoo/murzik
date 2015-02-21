var React = require('expose?React!react');
var {run} = require('react-router');
var router = require('router.js');
var socket = io();
document.addEventListener('DOMContentLoaded', function() {
  router.run(function (Handler, state) {
    React.render(<Handler />, document.body);
  });
});
