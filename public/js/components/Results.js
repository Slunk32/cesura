"use strict";

import React from 'react';
import Track from './Track';
import Player from './Player';
import SearchBar from './SearchBar';
import { track } from '../propTypes/spotify';

const Results = React.createClass({
	propTypes: {
		tracks: React.PropTypes.arrayOf(track),
		playingTrack: track
	},

	getDefaultProps() {
		return {
			tracks: []
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
		return this.props.tracks.map((track, index) => <Track track={track} key={index} />)
	}
});

module.exports = Results
