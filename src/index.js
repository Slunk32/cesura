import express from 'express';
import SpotifyWebApi from 'spotify-web-api-node';
require('dotenv').config();

process.on('unhandledRejection', err => { throw err; });

const SCOPES = ['user-read-private', 'playlist-modify-private'];
const REDIRECT_URI = 'http://localhost:8000/authenticate';
const SPOTIFY_ID = process.env.SPOTIFY_ID;

const spotifyApi = new SpotifyWebApi({
	clientId: SPOTIFY_ID,
	clientSecret: process.env.SPOTIFY_SECRET,
	redirectUri: REDIRECT_URI
});


const app = express();
app.set('view engine', 'ejs');

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
		// .then(artists => Promise.all(artists.map(artist => getTopTrack(artist.id))))
		.then(artists => {
			res.status(200).send(artists);
		});
});

app.get('/login', function(req, res) {
	res.redirect('https://accounts.spotify.com/authorize' +
	  '?response_type=token' +
	  '&client_id=' + SPOTIFY_ID +
	  '&scope=' + encodeURIComponent(SCOPES.join(' ')) +
	  '&redirect_uri=' + encodeURIComponent(REDIRECT_URI));
});

app.get('/authenticate', function(req, res) {
	res.status(200).render('authorize');
});

app.use(express.static('public'));

app.all('*', function(req, res) {
	res.render('layout');
});

app.listen(8000, function() {
	console.log('Server Online');
});
