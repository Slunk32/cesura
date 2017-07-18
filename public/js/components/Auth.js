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

function checkForToken(event) {
	try {
		const hash = JSON.parse(event.data);
	} catch (e) {
		return e;
	}

	if (hash.type == 'access_token') {
		actions.setAuthToken(hash.access_token);
		actions.fetchUserData(hash.access_token);
	}
}

const Auth = React.createClass({
	componentDidMount() {
		window.addEventListener('message', checkForToken, false);
		this.popup = window.open('/login', 'Spotify', buildPopupParams());
	},

	componentWillUnmount() {
		window.removeEventListener('message', checkForToken);

		if (this.popup) {
			this.popup.close();
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
