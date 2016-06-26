"use strict";

import React from 'react';
import Track from './Track';
import Input from './Input';
import actions from '../actions';
import Auth from './Auth';
import LoginButton from './LoginButton';
import { artist, track, playlist, user } from '../propTypes/spotify';

const DEFAULT_PLAYLIST_NAME = 'My Cesura Playlist';

const PlaylistView = React.createClass({
	propTypes: {
		user: user,
		playlist: playlist,
		likedTrackIds: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
		likedTracks: React.PropTypes.arrayOf(track)
	},

	handleCreatePlaylist() {
		actions.createPlaylist(DEFAULT_PLAYLIST_NAME);
	},

	handleSavePlaylistName(playlistName) {
		actions.updatePlaylistName(playlistName);
	},

	render() {
		return (
			<div>
				<LoginButton user={this.props.user} />
				{this.props.user && this.props.user.display_name}
				<div>
					{this.renderPlaylistName()}
				</div>
				{this.renderPlaylistTracks()}
			</div>
		);
	},

	renderPlaylistName() {
		if (this.props.user && this.props.playlist) {
			return (
				<Input className="playlist-name-input"
					initialValue={DEFAULT_PLAYLIST_NAME}
					onSave={this.handleSavePlaylistName} />
			);
		} else if (this.props.user) {
			return (
				<button onClick={this.handleCreatePlaylist}>
					Create A Playlist
				</button>
			);
		}
	},

	renderPlaylistTracks() {
		const playlistTracks = this.props.playlist ? this.props.playlist.tracks.items.map(item => item.track).filter(playlistTrack => {
			return this.props.likedTrackIds.indexOf(playlistTrack.id) === -1;
		}) : [];
		const likedTracks = this.props.likedTracks ? this.props.likedTracks : [];
		return likedTracks.concat(playlistTracks).map((track) => {
			return (<Track track={track} likedTrackIds={this.props.likedTrackIds} key={track.id} />);
		});
	}
});

module.exports = PlaylistView;
