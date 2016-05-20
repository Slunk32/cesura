import express from 'express'
import SpotifyWebApi from 'spotify-web-api-node'

const spotifyApi = new SpotifyWebApi()
const app = express()


spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE', {limit: 10, offset: 20})
    .then(function(data) {
        console.log('Album information', data.body)
    }, function(err) {
        console.error(err)
    })




app.all('*', function(req, res) {
    res.status(404).send("Page doesn't exist")
    res.end()
})

app.listen(8000, function() {
    console.log('Server Online')
})
