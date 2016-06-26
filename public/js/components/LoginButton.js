"use strict";

import React from 'react';
import Auth from './Auth';
import { user } from '../propTypes/spotify';
import actions from '../actions';

const LoginButton = React.createClass({
	propTypes: {
		user: user
	},

	getInitialState() {
		return {
			showAuth: false
		}
	},

	handleLogin() {
		this.setState({
			showAuth: true
		});
	},

	handleLogout() {
		this.setState({
			showAuth: false
		}, () => actions.removeUser());
	},

	render() {
		const auth = this.state.showAuth ? (<Auth />) : undefined;
		let button;

		if (!this.props.user) {
			button = (
				<button onClick={this.handleLogin}>
					Login
				</button>
			);
		} else {
			return (
				<button onClick={this.handleLogout}>
					Logout
				</button>
			);
		}

		return (
			<span>
				{auth}
				{button}
			</span>
		);
	}
});

module.exports = LoginButton;
