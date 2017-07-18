"use strict";

const ActionConstants = {
	receivedTracks: 'receivedTracks',
	playTrack: 'playTrack',
	stopTrack: 'stopTrack',
	likeTrack: 'likeTrack',
	dislikeTrack: 'dislikeTrack',
	receivedArtists: 'receivedArtists',
	failedToFindArtist: 'failedToFindArtist',
	beginArtistEdit: 'beginArtistEdit',
	setAuthToken: 'setAuthToken',
	artistSelected: 'artistSelected',
	popularTracksForArtistReceived: 'popularTracksForArtistReceived',
	receivedUserData: 'receivedUserData',
	playlistCreated: 'playlistCreated',
	playlistUpdating: 'playlistUpdating',
	playlistUpdateSaved: 'playlistUpdateSaved',
	playlistUpdateFailed: 'playlistUpdateFailed',
	removeUser: 'removeUser',
	fetchUserPlaylistsRequested: 'fetchUserPlaylistsRequested',
	fetchUserPlaylistsSucceeded: 'fetchUserPlaylistsSucceeded',
	fetchUserPlaylistsFailed: 'fetchUserPlaylistsFailed',
	fetchPlaylistRequested: 'fetchPlaylistRequested',
	fetchPlaylistSucceeded: 'fetchPlaylistSucceeded',
	fetchPlaylistFailed: 'fetchPlaylistFailed',
};

module.exports = ActionConstants;
