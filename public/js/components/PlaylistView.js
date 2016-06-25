"use strict";

import React from 'react';
import Track from './Track';
import actions from '../actions';
import { artist, track, playlist } from '../propTypes/spotify';


const PlaylistView = React.createClass({
	propTypes: {
		playlist: playlist,
		likedTrackIds: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
		likedTracks: React.PropTypes.arrayOf(track)
	},

	render() {
		return (
			<div>
				<h1> This is the playlist view </h1>
				<p>
				{this.props.playlist && this.props.playlist.name}
				</p>
				{this.renderPlaylistTracks()}
			</div>
		);
	},

	renderPlaylistTracks() {
		const playlistTracks = this.props.playlist ? this.props.playlist.tracks.items.map(item => item.track) : [];
		const likedTracks = this.props.likedTracks ? this.props.likedTracks : [];
		return playlistTracks.concat(likedTracks).map((track) => {
			return (<Track track={track} likedTrackIds={this.props.likedTrackIds} key={track.id} />);
		});
	}
});

module.exports = PlaylistView;
