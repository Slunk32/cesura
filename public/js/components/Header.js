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
					{this.props.user && this.props.user.display_name}
				</div>
			</div>
		);
	}
});

module.exports = Header;
