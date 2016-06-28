"use strict";

import React from 'react';
import actions from '../actions';

const AUTH_REGEX = /access_token[=](.*?)[&]/;
const POLLING_INTERVAL = 1000;
const POPUP_WIDTH = 450;
const POPUP_HEIGHT = 730;
const POPUP_PARAMS = 'menubar=no,location=no,resizable=no,scrollbars=no,status=no';

function buildPopupParams() {
	const screenWidth = screen.width;
	const screenHeight = screen.height;
	const left = (screenWidth / 2) - (POPUP_WIDTH / 2);
	const top = (screenHeight / 2) - (POPUP_HEIGHT / 2);
	return `${POPUP_PARAMS},width=${POPUP_WIDTH},height=${POPUP_HEIGHT},top=${top},left=${left}`;
}

const Auth = React.createClass({
	componentDidMount() {
		this.popup = window.open('/login', 'Spotify', buildPopupParams());
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
			const authToken = result && result[1];
			if (authToken) {
				this.popup.close();
				actions.setAuthToken(authToken);
				actions.fetchUserData(authToken);
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

module.exports = Auth;
