"use strict";

import React from 'react';
import { playlist, track } from '../propTypes/spotify';
import actions from '../actions';

const PlaylistEditor = React.createClass({
	propTypes: {
		playlist: playlist,
		playlistUpdateStatus: React.PropTypes.string
	},

	getInitialState() {
		return {
			name: this.props.playlist && this.props.playlist.name || '',
			tracks: this.props.playlist && this.props.playlist.tracks.items.map(item => item.track) || []
		};
	},

	componentWillReceiveProps(nextProps) {
		if (nextProps.playlist && nextProps.playlist.name) {
			this.setState({
				name: nextProps.playlist.name
			});
		}
	},

	handleNameChange(event) {
		this.setState({
			name: event.target.value
		});
	},


	handleSaveClick(event) {
		event.preventDefault();

		if (this.props.playlist && this.state.name !== this.props.playlist.name) {
			actions.updatePlaylistName(this.state.name);
		} else {
			actions.updatePlaylistItems();
		}
	},

	render() {
		return (
			<div className="playlist-editor">
      	<div>
      		<input
      			type="text"
      			value={this.state.name}
      			onChange={this.handleNameChange}
      			disabled={this.playlistUpdateStatus === 'updating'} />
	        <button
	        	type="button"
	        	onClick={this.handleSaveClick}
	        	disabled={this.playlistUpdateStatus === 'updating'}
	        >
	        	Save
	        </button>
				</div>
				<div>
					{this.renderTracks()}
				</div>
			</div>
		);
	},

	renderTracks() {
		return this.state.tracks.map((track, index) => {
			return (
				<Track
					track={track}
					likedTrackIds={this.props.likedTrackIds}
					key={index} />
			);
		});
	}
});

module.exports = PlaylistEditor;
