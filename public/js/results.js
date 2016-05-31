"use strict";

function play(uri) {
	var player = document.getElementsByClassName('player')[0];
	player.src = '';
	player.src = uri;
}

var results = {
	onDomLoaded: function() {
		var playLinks = Array.from(document.getElementsByClassName('track'));
		playLinks.forEach(function(playLink) {
			playLink.addEventListener('click', play.bind(null, playLink.dataset.previewUrl))
		});
	}
}

module.exports = results;