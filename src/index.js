import express from 'express'
import SpotifyWebApi from 'spotify-web-api-node'
process.on('unhandledRejection', err => { throw err })

const spotifyApi = new SpotifyWebApi({
    clientId : 'IDHERE',
    clientSecret : 'SECRETHERE'
})

const app = express()



async function main_p() {

    let artistAlbums = await spotifyApi.getArtistAlbums('0ybFZ2Ab08V8hueghSXm6E')

    console.log(artistAlbums.body.items.length)
    artistAlbums.body.items.forEach(function(albums) {
        console.log(albums.name)
    })

}


app.all('*', function(req, res) {
    res.status(404).send("Page doesn't exist")
    res.end()
})

app.listen(8000, function() {
    console.log('Server Online')
})


main_p()
