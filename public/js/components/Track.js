"use strict";

import React from 'react';
import { track } from '../propTypes/spotify';
import actions from '../actions';

const Track = React.createClass({
	propTypes: {
		track: track.isRequired,
		likedTrackIds: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
	},

	handleClick() {
		actions.playTrack(this.props.track)
	},

	handleLike(event) {
		event.stopPropagation();
		actions.likeTrack(this.props.track)
	},

	handleDislike(event) {
		event.stopPropagation();
		actions.dislikeTrack(this.props.track)
	},

	render() {
        return (
        	<div className="track" onClick={this.handleClick}>
				<div className="album-art">
					<img className="album-cover" src={this.props.track.album.images[0].url} />
				</div>
				<div className="track-details">
					<div>
			    		<p>
				    		{this.props.track.name}
			    		</p>
			    		<p>
				    		{this.props.track.artists[0].name}
			    		</p>
			    	</div>
		    	</div>
				<div>
					{this.renderLikeButton()}
				</div>
			</div>
		)
	},

	renderLikeButton() {
		if (this.props.likedTrackIds.indexOf(this.props.track.id) === -1) {
			return (
				<button className="like" onClick={this.handleLike}>
					Like?
				</button>
			)
		} else {
			return (
				<button className="dislike" onClick={this.handleDislike}>
					Liked!
				</button>
			)
		}
	}
})

module.exports = Track
