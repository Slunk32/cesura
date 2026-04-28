"use strict";

import React from 'react';
import { artist } from '../propTypes/spotify';
import actions from '../actions';

const DEFAULT_IMAGE_URL = 'http://vignette4.wikia.nocookie.net/nocopyrightsounds/images/f/fe/Spotify-icon.jpg/revision/latest'

const Artist = React.createClass({
	propTypes: {
		artist: artist.isRequired,
		selectedArtist: artist
	},

	handleClick() {
		actions.selectArtist(this.props.artist);
	},

	render() {
		const isSelected = this.props.selectedArtist && this.props.selectedArtist.id === this.props.artist.id;
		const artistClassName = isSelected ? 'artist artist-selected' : 'artist';
		const imageUrl = this.props.artist.images.length > 0 ? this.props.artist.images[this.props.artist.images.length - 1].url : DEFAULT_IMAGE_URL;

		return (
			<div className={artistClassName} onClick={this.handleClick}>
				<div className="artist-art" style={{ backgroundImage: `url('${imageUrl}')` }} />
				<div className="artist-details">
					{this.props.artist.name}
				</div>
			</div>
		);
	}
});

module.exports = Artist;
