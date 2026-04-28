"use strict";

import React from 'react';

const D = 'M114.588,45.42h28.17L97.338,0l-45.42,45.42h28.516C76.4,98.937,48.529,142.173,12.381,152.686 ' +
	'c5.513,1.605,11.224,2.452,17.071,2.452C73.601,155.139,109.94,107.111,114.588,45.42z';

const CurvedArrow = React.createClass({
	propTypes: {
		className: React.PropTypes.string
	},

	render() {
		return (
			<svg className={this.props.className}
				xmlns="http://www.w3.org/2000/svg"
				version="1.1"
				x="0px"
				y="0px"
				viewBox="0 0 155.139 155.139"
				style={{ enableBackground: 'new 0 0 155.139 155.139' }}
			>
				<g>
					<path style={{ fill: '#FFF' }} d={D} />
				</g>
			</svg>
		);
	}
});

module.exports = CurvedArrow;
