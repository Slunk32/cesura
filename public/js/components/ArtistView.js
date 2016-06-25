"use strict";

import React from 'react';
import Track from './Track';
import actions from '../actions';
import { artist, track } from '../propTypes/spotify';


const ArtistView = React.createClass({
	propTypes: {
		artist: artist.isRequired,
		artistTrackList: React.PropTypes.arrayOf(track),
		likedTrackIds: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
	},


	getDefaultProps() {
		return {
			artistTrackList: []
		};
	},

	componentDidMount() {
		if (this.props.artistTrackList.length === 0) {
			actions.fetchPopularTracksForArtist(this.props.artist);
		}
	},

	componentWillReceiveProps(nextProps) {
		if (nextProps.artistTrackList.length === 0) {
			actions.fetchPopularTracksForArtist(nextProps.artist);
		}
	},

	render() {
		return (
			<div>
				<img className="artist-view-image" src={this.props.artist.images[0].url} />
				{this.renderPopularTracks()}
			</div>
		);
	},

	renderPopularTracks() {
		return this.props.artistTrackList.map((track, index) => {
			return (<Track track={track} likedTrackIds={this.props.likedTrackIds} key={index} />);
		});
	}

});

module.exports = ArtistView;
