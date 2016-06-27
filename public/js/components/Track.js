"use strict";

import React from 'react';
import { track } from '../propTypes/spotify';
import actions from '../actions';

const Track = React.createClass({
	propTypes: {
		track: track.isRequired,
		playingTrack: track,
		likedTrackIds: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
	},

	handlePlayTrack() {
		actions.playTrack(this.props.track);
		this.render();
	},

	handleStopTrack() {
		actions.stopTrack(this.props.track);
		this.render();
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
		return (
			<div className={this.renderTrackDiv()} onClick={this.renderPlayingDiv()}>
				<div className="album-art" style={{ backgroundImage: `url('${this.props.track.album.images[0].url}')` }} />
				<div className="track-details">
					{this.props.track.name}
				</div>
				<div>
					{this.renderLikeButton()}
				</div>
			</div>
		);
	},

	renderTrackDiv() {
		if (this.props.playingTrack && this.props.playingTrack.id === this.props.track.id) {
			return (
				"track playing-now"
			);
		} else {
			return (
				"track not-playing"
			);
		}
	},

	renderPlayingDiv() {
		if (this.props.playingTrack && this.props.playingTrack.id === this.props.track.id) {
			return (
				this.handleStopTrack
			);
		} else {
			return (
				this.handlePlayTrack
			);
		}
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
