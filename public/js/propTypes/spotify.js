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
	preview_url: React.PropTypes.string.isRequired,
	album: album.isRequried,
	name: React.PropTypes.string.isRequried,
	artists: React.PropTypes.arrayOf(artist).isRequried
});

const PropTypes = {
	image,
	artist,
	track,
	album
};

module.exports = PropTypes;
