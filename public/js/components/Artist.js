"use strict";

import React from 'react';
import { artist } from '../propTypes/spotify';
import actions from '../actions';

const Artist = React.createClass({
	propTypes: {
		artist: artist.isRequired,
		artistSelected: artist
	},

	handleClick() {
		actions.selectArtist(this.props.artist);
	},

	render() {
		return (
			<div className={this.renderStylingDiv()} onClick={this.handleClick}>
				<div className="artist-art" style={{ backgroundImage: `url('${this.props.artist.images[0].url}')` }} />
				<div className="artist-details">
					{this.props.artist.name}
				</div>
			</div>
		);
	},

	renderStylingDiv() {
		if (this.props.artistSelected && this.props.artistSelected.id === this.props.artist.id) {
			return (
				"artist artist-selected"
			);
		} else {
			return (
				"artist artist-not-selected"
			);
		}
	},

});

module.exports = Artist;
