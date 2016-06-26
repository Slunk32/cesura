"use strict";

import React from 'react';

const Input = React.createClass({
	propTypes: {
		initialValue: React.PropTypes.string,
		onSave: React.PropTypes.func.isRequired
	},

	getInitialState() {
		return {
			value: this.props.initialValue,
			editing: false
		};
	},

	handleBeginEdit() {
		this.setState({
			editing: true 
		});
	},

	handleKeyDown(event) {
		if (event.keyCode === 27) {
			this.cancel(event.target);
		} else if (event.keyCode === 13) {
			event.target.blur();
		}
	},

	handleBlur(event) {
		this.save(event.target);
	},

	cancel(input) {
		this.setState({
			editing: false
		});
	},

	save(input) {
		this.setState({
			value: input.value,
			editing: false
		}, () => this.props.onSave(this.state.value));
	},

	render() {
		if (!this.state.editing) {
			return (
				<span className={this.props.className} onClick={this.handleBeginEdit} style={{cursor: 'pointer'}}>
					{this.state.value}
				</span>
			);
		} else {
			return (
	      		<input
	      			type="text"
	      			className={this.props.className}
	      			defaultValue={this.state.value}
	      			onBlur={this.handleBlur}
	      			onKeyDown={this.handleKeyDown} />
			);
		}
	}
});

module.exports = Input;
