"use strict";

import React from 'react';
import { track } from '../propTypes/spotify';
import actions from '../actions';

const SearchBar = React.createClass({
	getInitialState() {
		return {
			value: ''
		}
	},

	handleChange: function(event) {
		this.setState({
			value: event.target.value
		});
	},

	handleSubmit: function(event) {
		event.preventDefault();
		actions.fetchArtists(this.state.value);
	},

	render: function() {
		return (
			<form onSubmit={this.handleSubmit}>
				<div className="row">
					<input
						className="col stretched"
						type="text"
						onChange={this.handleChange}
						placeholder="Search for an Artist"
					/>
					<button disabled={this.state.value ? false : 'disabled'}>Search</button>
				</div>
			</form>
	   );
	}
});

module.exports = SearchBar;
