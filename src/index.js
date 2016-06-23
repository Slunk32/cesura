import express from 'express'
import SpotifyWebApi from 'spotify-web-api-node'
process.on('unhandledRejection', err => { throw err })

const spotifyApi = new SpotifyWebApi({
    clientId : process.env.SPOTIFY_ID,
    clientSecret : process.env.SPOTIFY_SECRET
})

const app = express()
app.set('view engine', 'ejs')

// TODO: seperate these helper functions into another file and import them. thoughts?

async function topTrackPreview(artist) {
    let topTracks = await spotifyApi.getArtistTopTracks(artist, 'US')
    return topTracks.body.tracks[0].preview_url
}

async function searchTracksByArtist(artist) {
    return await spotifyApi.searchTracks(`artist:${artist}`)
}

async function getArtistId(artistName) {
    return await spotifyApi.searchArtists(artistName, { limit: 1 })
        .then(result => {
            return result.body.artists.items[0].id
        })
}

// Note this requires Authentication
async function getRecommendedTracksForArtist(artistName) {
    const artistId = getArtistId(artistName)
    return await spotifyApi.getRecommendations({ seed_artists: [artistId] })
}

async function getRelatedArtists(artistId) {
    return await spotifyApi.getArtistRelatedArtists(artistId).then(result => {
        return result.body.artists
    })
}

async function getTopTrack(artistId) {
    return await spotifyApi.getArtistTopTracks(artistId, 'US').then(result => {
        return result.body.tracks[0]
    })
}

app.get('/search/:artist', function(req, res) {
    const artist = req.params.artist
    searchTracksByArtist(artist).then(result => {
        const tracks = result.body && result.body.tracks && result.body.tracks.items || []
        res.status(200).send(tracks)
    })
})

app.get('/recommended/:artist', function(req, res) {
    const artistName = req.params.artist

    getArtistId(artistName)
        .then(getRelatedArtists)
        .then(artists => Promise.all(artists.map(artist => getTopTrack(artist.id))))
        .then(topTracks => {
            res.status(200).send(topTracks)
        })
})

app.use(express.static('public'))

app.all('*', function(req, res) {
    res.render('layout')
})

app.listen(8000, function() {
    console.log('Server Online')
})
