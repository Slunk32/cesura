"use strict";

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';
import App from './components/App';
import Auth from './components/Auth';
import Results from './components/Results';
import NoMatch from './components/NoMatch';

function registerApp() {
	render((
	  <Router history={browserHistory}>
		<Route component={App}>
		  <Route path="/" component={Results} />
		  <Route path="/auth" component={Auth} />
		  <Route path="*" component={NoMatch} />
		</Route>
	  </Router>
  ), document.getElementsByClassName('app')[0]);
}

document.addEventListener("DOMContentLoaded", function() {
	registerApp();
});
