"use strict";

import React from 'react';
import { track } from '../propTypes/spotify';

const Player = React.createClass({
	propTypes: {
		track: track
	},

	getSrc() {
		return this.props.track ? this.props.track.preview_url : ''
	},

	render() {
        return (
        	<iframe className="player" src={this.getSrc()}></iframe>
		);
	}
});

module.exports = Player;
