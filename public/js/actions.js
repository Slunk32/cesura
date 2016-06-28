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

	stopTrack(track) {
		dispatcher.dispatch({
			type: actionConstants.stopTrack,
			payload: track
		});
	},

	likeTrack(track) {
		dispatcher.dispatch({
			type: actionConstants.likeTrack,
			payload: track
		});

		Actions.updatePlaylist([track.id]);
	},

	dislikeTrack(track) {
		dispatcher.dispatch({
			type: actionConstants.dislikeTrack,
			payload: track
		});

		Actions.updatePlaylist([track.id], true);
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
		const authToken = store.getAuthToken();
		const userId = store.getUser().id;

		return ajax.post('/create-playlist', {
			authToken,
			userId,
			playlistName
		})
			.then(playlist => {
				return ajax.post('/add-playlist-items', {
					authToken,
					userId,
					playlistId: playlist.id,
					trackIds: store.getLikedTrackIds().map(trackId => `spotify:track:${trackId}`).join(',')
				});
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

	removeUser() {
		dispatcher.dispatch({
			type: actionConstants.removeUser
		});
	},

	updatePlaylist(trackList, remove = false) {
		const playlist = store.getPlaylist();
		const url = remove ? '/remove-playlist-items' : '/add-playlist-items';

		if (playlist) {
			dispatcher.dispatch({
				type: actionConstants.playlistUpdating
			});

			return ajax.post(url, {
				authToken: store.getAuthToken(),
				userId: store.getUser().id,
				playlistId: playlist.id,
				trackIds: trackList.map(trackId => `spotify:track:${trackId}`).join(',')
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
	}
};

module.exports = Actions;
