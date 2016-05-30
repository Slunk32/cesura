import express from 'express'
import SpotifyWebApi from 'spotify-web-api-node'
process.on('unhandledRejection', err => { throw err })

const spotifyApi = new SpotifyWebApi({
    clientId : process.env.SPOTIFY_ID,
    clientSecret : process.env.SPOTIFY_SECRET
})

const app = express()
app.set('view engine', 'ejs');


async function getArtistAlbums() {
    const artistAlbums = await spotifyApi.getArtistAlbums('0ybFZ2Ab08V8hueghSXm6E')
    let albumNames = artistAlbums.body.items.map(function(albums) {
        return albums.name
    })
    return albumNames
}

async function searchTracksByArtist(artist) {
    return await spotifyApi.searchTracks(`artist:${artist}`) 
}

app.get('/', function(req, res) {
    getArtistAlbums().then(result => {
        console.log('result', result)
        res.send(result)
        res.end()
    })
})

app.get('/search/:artist', function(req, res) {
    const artist = req.params.artist || 'Kendrick Lamar'
    searchTracksByArtist(artist).then(result => {
        const tracks = result.body && result.body.tracks && result.body.tracks.items || []
        res.render('results', {
            tracks: tracks
        })
    })
})

app.use(express.static('public'));

app.all('*', function(req, res) {
    res.status(404).send("Page doesn't exist")
    res.end()
})

app.listen(8000, function() {
    console.log('Server Online')
})
