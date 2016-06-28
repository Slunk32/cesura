"use strict";

import React from 'react';
import actions from '../actions';
import LoginButton from './LoginButton';
import { user } from '../propTypes/spotify';

const Header = React.createClass({
	propTypes: {
		user: user
	},

	render() {
		return (
			<div className="header">
				<span>Cesura</span>
				<div className="pull-right">
					<LoginButton className="pull-right" user={this.props.user} />
				</div>
				<div className="pull-right">
					{this.renderUserProfile()}
				</div>
			</div>
		);
	},

	renderUserProfile() {
		if (this.props.user) {
			if (this.props.user.images && this.props.user.images.length > 0) {
				return <div className="profile-pic" style={{ backgroundImage: `url('${this.props.user.images[0].url}')` }} />
			} else {
				return this.props.user.display_name;
			}
		}
	}
});

module.exports = Header;
