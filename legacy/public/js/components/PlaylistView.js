"use strict";

import React from 'react';
import Track from './Track';
import Input from './Input';
import actions from '../actions';
import Auth from './Auth';
import LoginButton from './LoginButton';
import { artist, track, playlist, user } from '../propTypes/spotify';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Select from 'react-select';

const DEFAULT_PLAYLIST_NAME = 'My Cesura Playlist';

const PlaylistView = React.createClass({
	propTypes: {
		user: user,
		playlist: playlist,
		userPlaylists: React.PropTypes.arrayOf(React.PropTypes.shape({
			id: React.PropTypes.string.isRequired,
			name: React.PropTypes.string.isRequired
		})),
		likedTrackIds: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
		likedTracks: React.PropTypes.arrayOf(track)
	},

	handleCreatePlaylist() {
		actions.createPlaylist(DEFAULT_PLAYLIST_NAME);
	},

	handlePlaylistChange({ value }) {
		actions.fetchPlaylist(value);
	},

	handleSavePlaylistName(playlistName) {
		actions.updatePlaylistName(playlistName);
	},

	render() {
		return (
			<div className="playlist-view">
				<div className="row">
					<div className="col">
						{this.renderPlaylistSelect()}
					</div>
				</div>
				<div className="row">
					<div className="col">
						{this.renderPlaylistName()}
					</div>
				</div>
				<ReactCSSTransitionGroup transitionName="list" transitionEnterTimeout={250} transitionLeaveTimeout={250}>
					{this.renderPlaylistTracks()}
				</ReactCSSTransitionGroup>
			</div>
		);
	},

	renderPlaylistName() {
		if (this.props.user && this.props.playlist) {
			return (
				<div>
					<Input className="playlist-name-input"
						initialValue={this.props.playlist.name}
						onSave={this.handleSavePlaylistName} />
				</div>
			);
		} else if (this.props.user) {
			return (
				<button onClick={this.handleCreatePlaylist}>
					Create A Playlist
				</button>
			);
		}
	},

	renderPlaylistSelect() {
		if (this.props.user && this.props.userPlaylists) {
			return (
				<Select
					name="form-field-playlist"
					onChange={this.handlePlaylistChange}
					options={this.renderPlaylistOptions()}
					value={this.props.playlist && this.props.playlist.id}
				/>
			);
		}
	},

	renderPlaylistOptions() {
		return this.props.userPlaylists.map(({ id, name }) => ({
			value: id,
			label: name,
		}));
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
