"use strict";

import actionConstants from './action_constants';
import dispatcher from './dispatcher';

const Actions = {
	fetchTracks(artist) {
		fetch(`/recommended/${artist}`)
			.then(resp => resp.json())
			.then(artists => {
				dispatcher.dispatch({
					type: actionConstants.receivedArtists,
					payload: artists
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
	},

	selectArtist(artist) {
		dispatcher.dispatch({
			type: actionConstants.artistSelected,
			payload: artist
		});
	},

	fetchPopularTracksForArtist(artist) {
		fetch(`/search/${artist.name}`)
			.then(resp => resp.json())
			.then(tracks => {
				dispatcher.dispatch({
					type: actionConstants.popularTracksForArtistReceived,
					payload: tracks
				});
			});
	}
};

module.exports = Actions;
