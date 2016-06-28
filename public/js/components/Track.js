"use strict";

import React from 'react';
import { track } from '../propTypes/spotify';
import actions from '../actions';

const DEFAULT_IMAGE_URL = 'http://vignette4.wikia.nocookie.net/nocopyrightsounds/images/f/fe/Spotify-icon.jpg/revision/latest';

const Track = React.createClass({
	propTypes: {
		track: track.isRequired,
		playingTrack: track,
		likedTrackIds: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
	},

	handleTrackClick() {
		if (this.props.playingTrack && this.props.playingTrack.id === this.props.track.id) {
			actions.stopTrack(this.props.track);
		} else {
			actions.playTrack(this.props.track);
		}
	},

	handleLike(event) {
		event.stopPropagation();
		actions.likeTrack(this.props.track);
	},

	handleDislike(event) {
		event.stopPropagation();
		actions.dislikeTrack(this.props.track);
	},

	render() {
		const isPlaying = this.props.playingTrack && this.props.playingTrack.id === this.props.track.id;
		const trackClassNames = isPlaying ? "track playing-now" : "track";
		const imageUrl = this.props.track.album.images.length > 0 ? this.props.track.album.images[this.props.track.album.images.length - 1].url : DEFAULT_IMAGE_URL;

		return (
			<div className={trackClassNames} onClick={this.handleTrackClick}>
				<div className="album-art" style={{ backgroundImage: `url('${imageUrl}')` }} />
				<div className="track-details">
					{this.props.track.name}
				</div>
				<div>
					{this.renderLikeButton()}
				</div>
			</div>
		);
	},

	renderLikeButton() {
		if (this.props.likedTrackIds.indexOf(this.props.track.id) === -1) {
			return (
				<button className="like" onClick={this.handleLike}>
					Like?
				</button>
			);
		} else {
			return (
				<button className="dislike" onClick={this.handleDislike}>
					Liked!
				</button>
			);
		}
	}
});

module.exports = Track;
