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

app.get('/related/:id', async function(req, res) {
    const relatedArtistsResult = await spotifyApi.getArtistRelatedArtists(req.params.id)
    const relatedArtists = relatedArtistsResult.body.artists.map(function(artist) {
        return {
            name: artist.name,
            id: artist.id,
            images: artist.images
        }
    })

    // Create an array for us to fill with promises (basically just jobs we want to wait to finish)
    const relatedArtistPromises = relatedArtists.map((artist) => {

        // For each artist, we are going to go start to fetch their top tracks and fill in their preview URL
        return new Promise((resolve) => {

            // For this artist, fetch their top tracks
            spotifyApi.getArtistTopTracks(artist.id, 'US').then((apiResult) => {

                // If there are top tracks, grab the first and append it to their object
                if (apiResult.body.tracks.length > 0) {
                    artist.topTrackPreviewUrl = apiResult.body.tracks[0].preview_url
                }

                // Regardless, resolve the promise to let the script know we are done with this "job"
                resolve()
            })

        })
    })

    // Once all of our artists have had their additional top track filled in, send the response
    Promise.all(relatedArtistPromises).then(() => {
        res.send(relatedArtists)
    })

})

app.get('/search/:artist', function(req, res) {
    const artist = req.params.artist
    searchTracksByArtist(artist).then(result => {
        const tracks = result.body && result.body.tracks && result.body.tracks.items || []
        res.status(200).send(tracks)
    })
})

app.use(express.static('public'))

app.all('*', function(req, res) {
    res.render('layout')
})

app.listen(8000, function() {
    console.log('Server Online')
})
