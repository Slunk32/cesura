import express from 'express';
import SpotifyWebApi from 'spotify-web-api-node';
const bodyParser = require('body-parser');
require('dotenv').config();

process.on('unhandledRejection', err => { throw err; });

const SCOPES = ['user-read-private', 'playlist-modify-public'];
const REDIRECT_URI = '/authenticate';
const SPOTIFY_ID = process.env.SPOTIFY_ID;

const spotifyApi = new SpotifyWebApi({
	clientId: SPOTIFY_ID,
	clientSecret: process.env.SPOTIFY_SECRET,
	redirectUri: REDIRECT_URI
});

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

// TODO: seperate these helper functions into another file and import them. thoughts?

async function topTrackPreview(artist) {
	let topTracks = await spotifyApi.getArtistTopTracks(artist, 'US');
	return topTracks.body.tracks[0].preview_url;
}

async function searchTracksByArtist(artist) {
	return await spotifyApi.searchTracks(`artist:${artist}`);
}

async function getArtistId(artistName) {
	return await spotifyApi.searchArtists(artistName, { limit: 1 })
		.then(result => {
			return result.body.artists.items[0].id;
		});
}

// Note this requires Authentication
async function getRecommendedTracksForArtist(artistName) {
	const artistId = getArtistId(artistName);
	return await spotifyApi.getRecommendations({ seed_artists: [artistId] });
}

async function getRelatedArtists(artistId) {
	return await spotifyApi.getArtistRelatedArtists(artistId).then(result => {
		return result.body.artists;
	});
}

async function getTopTrack(artistId) {
	return await spotifyApi.getArtistTopTracks(artistId, 'US').then(result => {
		return result.body.tracks[0];
	});
}

app.get('/search/:artist', function(req, res) {
	const artist = req.params.artist;
	searchTracksByArtist(artist).then(result => {
		const tracks = result.body && result.body.tracks && result.body.tracks.items || [];
		res.status(200).send(tracks);
	});
});

app.get('/recommended/:artist', function(req, res) {
	const artistName = req.params.artist;

	getArtistId(artistName)
		.then(getRelatedArtists)
		.then(artists => {
			res.status(200).send(artists);
		});
});

app.post('/create-playlist', function(req, res) {
    const playlistName = req.body.playlistName;
    const authToken = req.body.authToken;
    const userId = req.body.userId;

    spotifyApi.setAccessToken(authToken);

    spotifyApi.createPlaylist(userId, playlistName)
        .then(resp => resp.body)
        .then(playlist => {
            res.status(200).send(playlist);
        });
});

app.post('/update-playlist-name', function(req, res) {
    const authToken = req.body.authToken;
    const userId = req.body.userId;
    const playlistId = req.body.playlistId;
    const playlistName = req.body.playlistName;

    spotifyApi.setAccessToken(authToken);

    spotifyApi.changePlaylistDetails(userId, playlistId, {
        name: playlistName
    })
        .then(() => spotifyApi.getPlaylist(userId, playlistId))
        .then(resp => resp.body)
        .then(playlist => {
            res.status(200).send(playlist);
        });
});

app.post('/add-playlist-items', function(req, res) {
    const authToken = req.body.authToken;
    const userId = req.body.userId;
    const playlistId = req.body.playlistId;
    const trackIds = req.body.trackIds;

    spotifyApi.setAccessToken(authToken);

    spotifyApi.addTracksToPlaylist(userId, playlistId, trackIds)
        .then(() => spotifyApi.getPlaylist(userId, playlistId))
        .then(resp => resp.body)
        .then(playlist => {
            res.status(200).send(playlist);
        })
        .catch(console.log);
});

app.post('/remove-playlist-items', function(req, res) {
    const authToken = req.body.authToken;
    const userId = req.body.userId;
    const playlistId = req.body.playlistId;
    const trackIds = req.body.trackIds.split(',').map(trackId => {
        return { uri: trackId };
    });

    spotifyApi.setAccessToken(authToken);

    spotifyApi.removeTracksFromPlaylist(userId, playlistId, trackIds)
        .then(() => spotifyApi.getPlaylist(userId, playlistId))
        .then(resp => resp.body)
        .then(playlist => {
            res.status(200).send(playlist);
        })
        .catch(console.log);
});

app.get('/login', function(req, res) {
    { protocol, host } = req.headers.host;

	res.redirect('https://accounts.spotify.com/authorize' +
	  '?response_type=token' +
	  '&client_id=' + SPOTIFY_ID +
	  '&scope=' + encodeURIComponent(SCOPES.join(' ')) +
	  '&redirect_uri=' + encodeURIComponent(protocol + host + REDIRECT_URI));
});

app.get('/authenticate', function(req, res) {
	res.status(200).render('authorize');
});

app.use(express.static('public'));

app.post('/user', function(req, res) {
    const authToken = req.body.authToken;

    spotifyApi.setAccessToken(authToken);

    spotifyApi.getMe()
        .then(user => {
            res.status(200).send(user.body);
        })
        .catch(error => {
            console.log(error);
        });
});

app.all('*', function(req, res) {
	res.render('layout');
});

app.listen((process.env.PORT || 8000), function() {
	console.log('Server Online');
});
