"use strict";

import actionConstants from './action_constants';
import dispatcher from './dispatcher';

const Actions = {
	fetchTracks(artist) {
		fetch(`/recommended/${artist}`)
			.then(resp => resp.json())
			.then(tracks => {
				dispatcher.dispatch({
					type: actionConstants.receivedTracks,
					payload: tracks
				});
			});
	},

	setAuthToken(authToken) {
		dispatcher.dispatch({
			type: actionConstants.setAuthToken,
			payload: authToken
		});
	},

	playTrack(track) {
		dispatcher.dispatch({
			type: actionConstants.playTrack,
			payload: track
		});
	},

	likeTrack(track) {
		dispatcher.dispatch({
			type: actionConstants.likeTrack,
			payload: track.id
		});
	},

	dislikeTrack(track) {
		dispatcher.dispatch({
			type: actionConstants.dislikeTrack,
			payload: track.id
		});
	}
};

module.exports = Actions;
