"use strict";

import React from 'react';
import { track } from '../propTypes/spotify';
import actions from '../actions';

const SearchBar = React.createClass({
	propTypes: {
		initialValue: React.PropTypes.string
	},

	getDefaultProps() {
		initialValue: '';
	},

	handleChange: function(event) {
		this.setState({
			value: event.target.value
		});
	},

	handleSubmit: function(event) {
		event.preventDefault();
		actions.fetchTracks(this.state.value);
	},

	render: function() {
		return (
			<form onSubmit={this.handleSubmit}>
				<input
					type="text"
					defaultValue={this.props.initialValue}
					onChange={this.handleChange}
				/>
				<button>Search</button>
			</form>
	   );
	}
});

module.exports = SearchBar;
