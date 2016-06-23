"use strict";

import actionConstants from './action_constants';
import dispatcher from './dispatcher';

const Actions = {
	fetchTracks(artist) {
		fetch(`/search/${artist}`)
			.then(resp => resp.json())
			.then(tracks => {
				dispatcher.dispatch({
					type: actionConstants.receivedTracks,
					payload: tracks
				})
			})
	},

	playTrack(track) {
		dispatcher.dispatch({
			type: actionConstants.playTrack,
			payload: track
		})
	}
}

module.exports = Actions;