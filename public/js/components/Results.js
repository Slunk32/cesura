"use strict";

import React from 'react';
import Track from './Track';
import Player from './Player';
import SearchBar from './SearchBar';
import { track } from '../propTypes/spotify';

const Results = React.createClass({
	propTypes: {
		tracks: React.PropTypes.arrayOf(track),
		playingTrack: track,
		likedTrackIds: React.PropTypes.arrayOf(React.PropTypes.string)
	},

	getDefaultProps() {
		return {
			tracks: [],
			likedTrackIds: []
		}
	},

	render() {
        return (
        	<div className="results">
        		<SearchBar />
        		{this.renderTracks()}
        		<Player track={this.props.playingTrack} />
			</div>
		);
	},

	renderTracks() {
		return this.props.tracks.map((track, index) => {
			return (
				<Track
					track={track}
					likedTrackIds={this.props.likedTrackIds}
					key={index} />
			);
		});
	}
});

module.exports = Results
