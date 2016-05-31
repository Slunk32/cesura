const results = require('./results');
const React = require('react');
const ReactDOM = require('react-dom');

function registerApp() {
	const app = document.getElementsByClassName('app')[0];

	ReactDOM.render(<h1>Hello, world!</h1>, app);
}

document.addEventListener("DOMContentLoaded", function() {
	registerApp()
	results.onDomLoaded()
});
