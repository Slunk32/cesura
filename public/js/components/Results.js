"use strict";

import React from 'react';
import Artist from './Artist';
import Player from './Player';
import SearchBar from './SearchBar';
import { track, artist, user } from '../propTypes/spotify';
import ArtistView from './ArtistView';
import PlaylistView from './PlaylistView';
import actions from '../actions';

const Results = React.createClass({
	propTypes: {
		playingTrack: track,
		likedTrackIds: React.PropTypes.arrayOf(React.PropTypes.string),
		selectedArtist: artist,
		artistTrackList: React.PropTypes.arrayOf(track),
		likedTracks: React.PropTypes.arrayOf(track),
		user: user
	},

	getDefaultProps() {
		return {
			likedTrackIds: [],
			likedTracks: []
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
				<div className="inline">
					<PlaylistView
						likedTrackIds={this.props.likedTrackIds}
						likedTracks={this.props.likedTracks}
						playlist={this.props.playlist}
						user={this.props.user} />
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
