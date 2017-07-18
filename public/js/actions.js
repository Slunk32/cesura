"use strict";

import actionConstants from './action_constants';
import dispatcher from './dispatcher';
import store from './store';
import ajax from './utils/ajax';

const Actions = {
	fetchArtists(artist) {
		return ajax.get(`/recommended/${artist}`)
			.then(artists => {
				if (artists && artists.length) {
					dispatcher.dispatch({
						type: actionConstants.receivedArtists,
						payload: artists
					});
				} else {
					throw true;
				}
			})
			.catch(() => {
				return dispatcher.dispatch({
					type: actionConstants.failedToFindArtist
				});
			});
	},

	beginArtistEdit() {
		dispatcher.dispatch({
			type: actionConstants.beginArtistEdit
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
			})
			.then(Actions.fetchUserPlaylists);
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
				const likedTrackIds = store.getLikedTrackIds();

				if (likedTrackIds.length > 0) {
					return ajax.post('/add-playlist-items', {
						authToken,
						userId,
						playlistId: playlist.id,
						trackIds: store.getLikedTrackIds().map(trackId => `spotify:track:${trackId}`).join(',')
					});
				} else {
					return Promise.resolve(playlist);
				}
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
	},

	fetchUserPlaylists() {
		dispatcher.dispatch({
			type: actionConstants.fetchUserPlaylistsRequested
		});

		return ajax.post('/get-playlists', {
			authToken: store.getAuthToken(),
			userId: store.getUser().id,
		})
		.then(playlists => {
			dispatcher.dispatch({
				type: actionConstants.fetchUserPlaylistsSucceeded,
				payload: playlists
			});
		})
		.catch(error => {
			dispatcher.dispatch({
				type: actionConstants.fetchUserPlaylistsFailed,
				payload: error
			});
		});
	},


	fetchPlaylist(playlistId) {
		dispatcher.dispatch({
			type: actionConstants.fetchPlaylistRequested
		});

		return ajax.post('/get-playlist', {
			authToken: store.getAuthToken(),
			userId: store.getUser().id,
			playlistId,
		})
		.then(playlists => {
			dispatcher.dispatch({
				type: actionConstants.fetchPlaylistSucceeded,
				payload: playlists
			});
		})
		.catch(error => {
			dispatcher.dispatch({
				type: actionConstants.fetchPlaylistFailed,
				payload: error
			});
		});
	}
};

module.exports = Actions;
