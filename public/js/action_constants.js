"use strict";

const ActionConstants = {
	receivedTracks: 'receivedTracks',
	playTrack: 'playTrack',
	stopTrack: 'stopTrack',
	likeTrack: 'likeTrack',
	dislikeTrack: 'dislikeTrack',
	receivedArtists: 'receivedArtists',
	setAuthToken: 'setAuthToken',
	artistSelected: 'artistSelected',
	popularTracksForArtistReceived: 'popularTracksForArtistReceived',
	receivedUserData: 'receivedUserData',
	playlistCreated: 'playlistCreated',
	playlistUpdating: 'playlistUpdating',
	playlistUpdateSaved: 'playlistUpdateSaved',
	playlistUpdateFailed: 'playlistUpdateFailed',
	removeUser: 'removeUser'
}

module.exports = ActionConstants;
