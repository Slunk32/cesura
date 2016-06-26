"use strict";

import React from 'react';
import { artist } from '../propTypes/spotify';
import actions from '../actions';

const Artist = React.createClass({
	propTypes: {
		artist: artist.isRequired
	},

	handleClick() {
		actions.selectArtist(this.props.artist);
	},

	render() {
		return (
			<div className="artist" onClick={this.handleClick}>
				<div className="artist-art" style={{ backgroundImage: `url('${this.props.artist.images[0].url}')` }} />
				<div className="artist-details">
					{this.props.artist.name}
				</div>
			</div>
		);
	},

});

module.exports = Artist;
