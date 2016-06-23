"use strict";

import React from 'react';
import { track } from '../propTypes/spotify';

const NoMatch = React.createClass({
	propTypes: {
		track: track
	},

	render() {
        return (
        	<div>
        		Sorry!
        	</div>
		);
	}
});

module.exports = NoMatch;
