"use strict";

import { EventEmitter } from 'events';
import actionConstants from './action_constants';
import symbol from 'es6-symbol';
import dispatcher from './dispatcher';

let info = {
	tracks: [],
	playingTrack: undefined,
	likedTrackIds: {}
};

function unionOfLikedTracksAndReceivedTracks(receivedTracks) {
	const likedTracks = info.tracks.filter(track => info.likedTrackIds[track.id]);
	const newReceivedTracks = receivedTracks.filter(track => !info.likedTrackIds[track.id])
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
		case actionConstants.likeTrack:
			info.likedTrackIds[action.payload] = true;
			break;
		case actionConstants.dislikeTrack:
			delete info.likedTrackIds[action.payload];
			break;
	}

	Store.emitChange();
}

dispatcher.register(handleChange);

module.exports = Store;