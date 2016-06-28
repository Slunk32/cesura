"use strict";

import React from 'react';
import { track, errors } from '../propTypes/spotify';
import actions from '../actions';

const SearchBar = React.createClass({
	propTypes: {
		errors: errors
	},

	getInitialState() {
		return {
			value: ''
		}
	},

	handleChange(event) {
		this.setState({
			value: event.target.value
		});

		if (this.props.errors.failedToFindArtist) {
			console.log('editing')
			actions.beginArtistEdit();
		}
	},

	handleSubmit(event) {
		console.log('submit')
		event.preventDefault();
		actions.fetchArtists(this.state.value);
	},

	render() {
		const inputClassName = this.props.errors.failedToFindArtist ? "col stretched input-errored" : "col stretched";
		const disabled = !this.state.value || this.props.errors.failedToFindArtist;

		return (
			<form onSubmit={this.handleSubmit}>
				<div className="row">
					<input
						className={inputClassName}
						type="text"
						onChange={this.handleChange}
						placeholder="Search for an Artist"
					/>
					<button disabled={disabled ? 'disabled' : ''}>Search</button>
				</div>
			</form>
	   );
	}
});

module.exports = SearchBar;
