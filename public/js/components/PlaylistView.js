"use strict";

import React from 'react';
import Track from './Track';
import actions from '../actions';
import { artist, track, playlist } from '../propTypes/spotify';


const PlaylistView = React.createClass({
	propTypes: {
		playlist: playlist,
		likedTrackIds: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
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
		if (this.props.playlist) {
			return this.props.playlist.tracks.items.map((item, index) => {
				return (<Track track={item.track} likedTrackIds={this.props.likedTrackIds} key={index} />);
			});
		}
	}
});

module.exports = PlaylistView;
