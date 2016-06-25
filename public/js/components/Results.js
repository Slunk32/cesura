"use strict";

import React from 'react';
import Artist from './Artist';
import Player from './Player';
import SearchBar from './SearchBar';
import { track, artist } from '../propTypes/spotify';
import ArtistView from './ArtistView';

const Results = React.createClass({
	propTypes: {
		tracks: React.PropTypes.arrayOf(track),
		playingTrack: track,
		likedTrackIds: React.PropTypes.arrayOf(React.PropTypes.string),
		selectedArtist: artist,
		artistTrackList: React.PropTypes.arrayOf(track)
	},

	getDefaultProps() {
		return {
			tracks: [],
			likedTrackIds: []
		};
	},

	render() {
		return (
			<div className="results">
				<div className="inline">
					<SearchBar />
					{this.renderArtists()}
					<Player track={this.props.playingTrack} />
				</div>
				<div className="inline">
					{this.renderArtistView()}
    		</div>
			</div>
		);
	},

	renderArtists() {
		return this.props.artists.map((artist, index) => {
			return (
				<Artist
					artist={artist}
					key={index} />
			);
		});
	},

	renderArtistView() {
		if (this.props.selectedArtist) {
			return (<ArtistView artist={this.props.selectedArtist} artistTrackList={this.props.artistTrackList} likedTrackIds={this.props.likedTrackIds} />);
		}
	}

});

module.exports = Results;
