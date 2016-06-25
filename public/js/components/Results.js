"use strict";

import React from 'react';
import Artist from './Artist';
import Player from './Player';
import SearchBar from './SearchBar';
import { track, artist } from '../propTypes/spotify';
import ArtistView from './ArtistView';
import PlaylistView from './PlaylistView';
import Auth from './Auth';
import actions from '../actions';

const Results = React.createClass({
	propTypes: {
		playingTrack: track,
		likedTrackIds: React.PropTypes.arrayOf(React.PropTypes.string),
		selectedArtist: artist,
		artistTrackList: React.PropTypes.arrayOf(track),
		likedTracks: React.PropTypes.arrayOf(track)
	},

	getDefaultProps() {
		return {
			likedTrackIds: [],
			likedTracks: []
		};
	},

	handleCreatePlaylistClick() {
		actions.createPlaylist(this.props.likedTrackIds);
	},

	render() {
		return (
			<div className="results">
				<Auth />
				<div className="inline">
					<div>
						<div class="inline">
							<SearchBar />
						</div>
						<div class="inline">
							{this.renderCreatePlaylistButton()}
						</div>
					</div>
					{this.renderArtists()}
					<Player track={this.props.playingTrack} />
				</div>
				<div className="inline">
					{this.renderArtistView()}
				</div>
				<div className="inline">
					<PlaylistView likedTrackIds={this.props.likedTrackIds} likedTracks={this.props.likedTracks} playlist={this.props.playlist} />
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
	},

	renderCreatePlaylistButton() {
		if (this.props.likedTrackIds.length > 0) {
			return (
				<button onClick={this.handleCreatePlaylistClick}>
					Create Playlist
				</button>
			);
		}
	}

});

module.exports = Results;
