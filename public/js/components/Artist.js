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
				<div className="artist-art">
					<img className="artist-image" src={this.props.artist.images[0].url} />
				</div>
				<div className="artist-details">
					<div>
						<p>
							{this.props.artist.name}
						</p>
					</div>
				</div>
			</div>
		);
	},

});

module.exports = Artist;
