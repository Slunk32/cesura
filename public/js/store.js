"use strict";

import { EventEmitter } from 'events';
import actionConstants from './action_constants';
import symbol from 'es6-symbol';
import dispatcher from './dispatcher';

let info = {
	tracks: [],
	playingTrack: undefined
};

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
	}
});

function handleChange(action) {
	switch(action.type) {
		case actionConstants.receivedTracks:
			info.tracks = action.payload;
			break;
		case actionConstants.playTrack:
			info.playingTrack = action.payload;
			break;
	}

	Store.emitChange();
}

dispatcher.register(handleChange);

module.exports = Store;