"use strict";

import { EventEmitter } from 'events';
import actionConstants from './action_constants';
import symbol from 'es6-symbol';
import dispatcher from './dispatcher';

let info = {
	playingTrack: undefined,
	likedTrackIds: {},
	authToken: undefined,
	artists: [],
	selectedArtist: undefined,
	selectedArtistTrackList: [],
	user: undefined,
	playlist: undefined,
	playlistStatus: undefined,
	userPlaylists: undefined,
	errors: {}
};

function unionOfLikedTracksAndReceivedTracks(receivedTracks) {
	const likedTracks = info.tracks.filter(track => info.likedTrackIds[track.id]);
	const newReceivedTracks = receivedTracks.filter(track => !info.likedTrackIds[track.id]);
	return likedTracks.concat(newReceivedTracks);
}

const Store = Object.assign({}, EventEmitter.prototype, {
	CHANGE_EVENT: symbol(),

	addChangeListener(callback) {
		this.on(this.CHANGE_EVENT, callback);
	},

	removeChangeListener(callback) {
		this.removeListener(this.CHANGE_EVENT, callback);
	},

	emitChange() {
		this.emit(this.CHANGE_EVENT);
	},

	getTracks() {
		return info.tracks;
	},

	getPlayingTrack() {
		return info.playingTrack;
	},

	getLikedTrackIds() {
		return Object.keys(info.likedTrackIds);
	},

	getAuthToken() {
		return info.authToken;
	},

	getArtists() {
		return info.artists;
	},

	getSelectedArtist() {
		return info.selectedArtist;
	},

	getSelectedArtistTrackList() {
		return info.selectedArtistTrackList;
	},

	getUser() {
		return info.user;
	},

	getPlaylist() {
		return info.playlist;
	},

	getPlaylistStatus() {
		return info.playlistStatus;
	},

	getLikedTracks() {
		return Object.keys(info.likedTrackIds).map(trackId => {
			return info.likedTrackIds[trackId];
		});
	},

	getErrors() {
		return info.errors;
	},

	getUserPlaylists() {
		return info.userPlaylists;
	}
});

function handleChange(action) {
	switch(action.type) {
	case actionConstants.receivedTracks:
		info.tracks = unionOfLikedTracksAndReceivedTracks(action.payload);
		break;
	case actionConstants.playTrack:
		info.playingTrack = action.payload;
		break;
	case actionConstants.stopTrack:
		info.playingTrack = undefined;
		break;
	case actionConstants.likeTrack:
		info.likedTrackIds[action.payload.id] = action.payload;
		break;
	case actionConstants.dislikeTrack:
		delete info.likedTrackIds[action.payload.id];
		break;
	case actionConstants.setAuthToken:
		info.authToken = action.payload;
		break;
	case actionConstants.receivedArtists:
		delete info.errors.failedToFindArtist;
		info.artists = action.payload;
		break;
	case actionConstants.failedToFindArtist:
		info.artists = [];
		info.errors.failedToFindArtist = true;
		break;
	case actionConstants.beginArtistEdit:
		delete info.errors.failedToFindArtist;
		break;
	case actionConstants.artistSelected:
		info.selectedArtist = action.payload;
		info.selectedArtistTrackList = [];
		break;
	case actionConstants.popularTracksForArtistReceived:
		info.selectedArtistTrackList = action.payload;
		break;
	case actionConstants.receivedUserData:
		info.user = action.payload;
		break;
	case actionConstants.playlistCreated:
		info.playlist = action.payload;
		break;
	case actionConstants.playlistUpdating:
		info.playlistStatus = 'syncing';
		break;
	case actionConstants.fetchPlaylistSucceeded:
	case actionConstants.playlistUpdateSaved:
		info.playlistStatus = 'saved';
		info.playlist = action.payload;
		break;
	case actionConstants.playlistUpdateFailed:
		info.playlistStatus = 'errored';
		break;
	case actionConstants.removeUser:
		info.user = undefined;
		info.authToken = undefined;
		info.userPlaylists = undefined;
		info.playlist = undefined;
		break;
	case actionConstants.fetchUserPlaylistsSucceeded:
		info.userPlaylists = action.payload;
		break;
	}

	Store.emitChange();
}

dispatcher.register(handleChange);

module.exports = Store;
