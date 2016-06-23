"use strict";

import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Link, browserHistory } from 'react-router'
import App from './components/App'
import Results from './components/Results'
import NoMatch from './components/NoMatch'

function registerApp() {
	render((
	  <Router history={browserHistory}>
	    <Route path="/" component={App}>
	      <Route path="/home" component={Results} />
	      <Route path="*" component={NoMatch} />
	    </Route>
	  </Router>
	), document.getElementsByClassName('app')[0])
}

document.addEventListener("DOMContentLoaded", function() {
	registerApp()
})
