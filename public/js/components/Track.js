"use strict";

import React from 'react';
import { track } from '../propTypes/spotify';
import actions from '../actions';

const Track = React.createClass({
	propTypes: {
		track: track.isRequired
	},

	handleClick() {
		actions.playTrack(this.props.track)
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
			</div>
		)
	}
})

module.exports = Track
