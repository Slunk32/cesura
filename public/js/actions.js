"use strict";

import actionConstants from './action_constants';
import dispatcher from './dispatcher';
import store from './store';
import ajax from './utils/ajax';

const Actions = {
	fetchArtists(artist) {
		return ajax.get(`/recommended/${artist}`)
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

	fetchUserData(authToken) {
		return ajax.post('/user', {
			authToken
		})
			.then(user => {
				dispatcher.dispatch({
					type: actionConstants.receivedUserData,
					payload: user
				});
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
			payload: track
		});

		Actions.updatePlaylistItems();
	},

	dislikeTrack(track) {
		dispatcher.dispatch({
			type: actionConstants.dislikeTrack,
			payload: track
		});

		Actions.updatePlaylistItems();
	},

	selectArtist(artist) {
		dispatcher.dispatch({
			type: actionConstants.artistSelected,
			payload: artist
		});
	},

	fetchPopularTracksForArtist(artist) {
		ajax.get(`/search/${artist.name}`)
			.then(tracks => {
				dispatcher.dispatch({
					type: actionConstants.popularTracksForArtistReceived,
					payload: tracks
				});
			});
	},

	createPlaylist(playlistName) {
		return ajax.post('/create-playlist', {
			authToken: store.getAuthToken(),
			userId: store.getUser().id,
			playlistName
		})
			.then(playlist => {
				dispatcher.dispatch({
					type: actionConstants.playlistCreated,
					payload: playlist
				});
			});
	},

	updatePlaylistName(playlistName) {
		dispatcher.dispatch({
			type: actionConstants.playlistUpdating
		});

		return ajax.post('/update-playlist-name', {
			authToken: store.getAuthToken(),
			userId: store.getUser().id,
			playlistId: store.getPlaylist().id,
			playlistName
		})
		.then(playlist => {
			dispatcher.dispatch({
				type: actionConstants.playlistUpdateSaved,
				payload: playlist
			});
		})
		.catch(error => {
			dispatcher.dispatch({
				type: actionConstants.playlistUpdateFailed,
				payload: error
			});
		});
	},

	updatePlaylistItems() {
		const playlist = store.getPlaylist();

		if (playlist) {
			dispatcher.dispatch({
				type: actionConstants.playlistUpdating
			});

			return ajax.post('/update-playlist-items', {
				authToken: store.getAuthToken(),
				userId: store.getUser().id,
				playlistId: playlist.id,
				trackIds: store.getLikedTrackIds().map(trackId => `spotify:track:${trackId}`).join(',')
			})
				.then(playlist => {
					dispatcher.dispatch({
						type: actionConstants.playlistUpdateSaved,
						payload: playlist
					});
				})
				.catch(error => {
					dispatcher.dispatch({
						type: actionConstants.playlistUpdateFailed,
						payload: error
					});
				});
		}
	},

	removeUser() {
		dispatcher.dispatch({
			type: actionConstants.removeUser
		});
	}
};

module.exports = Actions;
