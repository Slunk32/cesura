"use strict";

import React from 'react';

const image = React.PropTypes.shape({
	url: React.PropTypes.string.isRequired
});

const album = React.PropTypes.shape({
	images: React.PropTypes.arrayOf(image).isRequired
});

const artist = React.PropTypes.shape({
	name: React.PropTypes.string.isRequired
});

const track = React.PropTypes.shape({
	preview_url: React.PropTypes.string,
	album: album.isRequried,
	name: React.PropTypes.string.isRequried,
	artists: React.PropTypes.arrayOf(artist).isRequried,
	id: React.PropTypes.string.isRequried,
	uri: React.PropTypes.string.isRequried
});

const user = React.PropTypes.shape({
	country: React.PropTypes.string.isRequired,
	display_name: React.PropTypes.string.isRequired,
	id: React.PropTypes.string.isRequired,
	images: React.PropTypes.arrayOf(image).isRequired,
	product: React.PropTypes.string.isRequired
});

const playlist = React.PropTypes.shape({
	id: React.PropTypes.string.isRequired,
	href: React.PropTypes.string.isRequired,
	name: React.PropTypes.string.isRequired,
	images: React.PropTypes.arrayOf(image).isRequired,
	tracks: React.PropTypes.shape({
		items: React.PropTypes.arrayOf(React.PropTypes.shape({
			track: track.isRequired
		})).isRequired,
	}).isRequired,
	uri: React.PropTypes.string.isRequried
});

const errors = React.PropTypes.shape({
	failedToFindArtist: React.PropTypes.bool
});

const PropTypes = {
	image,
	playlist,
	artist,
	track,
	album,
	user,
	playlist,
	errors
};

module.exports = PropTypes;
