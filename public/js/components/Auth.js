"use strict";

import React from 'react';
import actions from '../actions';

const AUTH_REGEX = /access_token[=](.*?)[&]/;
const POLLING_INTERVAL = 2000;

const Auth = React.createClass({
	componentDidMount() {
		this.popup = window.open('/login', '_blank', 'width=300,height=600');
		this.timeout = window.setTimeout(this.checkForToken, POLLING_INTERVAL);
	},

	componentWillUnmount() {
		window.clearTimeout(this.timeout);

		if (this.popup) {
			this.popup.close();
		}
	},

	checkForToken() {
		if (this.popup.location.hash) {
			const result = AUTH_REGEX.exec(this.popup.location.hash);
			const authToken = result && result[1]
			if (authToken) {
				actions.setAuthToken(authToken);
				this.popup.close();
			} else {
				this.timeout = window.setTimeout(this.checkForToken, POLLING_INTERVAL);
			}
		}
	},

	render() {
        return (
        	<div className="Auth">
			</div>
		);
	}
});

module.exports = Auth
