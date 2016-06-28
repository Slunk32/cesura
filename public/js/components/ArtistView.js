"use strict";

import React from 'react';
import Track from './Track';
import actions from '../actions';
import { artist, track } from '../propTypes/spotify';

const DEFAULT_IMAGE_URL = 'http://vignette4.wikia.nocookie.net/nocopyrightsounds/images/f/fe/Spotify-icon.jpg/revision/latest';

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
		const imageUrl = this.props.artist.images.length > 0 ? this.props.artist.images[0].url : DEFAULT_IMAGE_URL;

		return (
			<div className="text-center">
				<div className="artist-view-image" style={{ backgroundImage: `url('${imageUrl}')` }} />
				<div className="text-large row">
					<div className="col">
						{this.props.artist.name}
					</div>
				</div>
				{this.renderPopularTracks()}
			</div>
		);
	},

	renderPopularTracks() {
		return this.props.artistTrackList.map((track, index) => {
			return (<Track track={track} playingTrack={this.props.playingTrack} likedTrackIds={this.props.likedTrackIds} key={index} />);
		});
	}

});

module.exports = ArtistView;
