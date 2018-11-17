import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'react-emotion'

import MessageEditor from './MessageEditor'
import Button from './Button'

const mentionOptions = [
	{
		id: '1',
		name: 'John Lennon'
	},
	{
		id: '2',
		name: 'Paul McCartney'
	},
	{
		id: '3',
		name: 'George Harrison'
	},
	{
		id: '4',
		name: 'Ringo Starr'
	}
]

class CommentEditor extends Component {
	state = {
		message: '',
		mentions: []
	}

	handleChange = (changes /*{ message, mentions }*/) => {
		this.setState(changes)
	}

	handleSubmit = () => {
		if (this.state.message.length > 0) {
			const comment = {
				message: this.state.message,
				mentions: this.state.mentions
			}

			this.setState({
				message: '',
				mentions: []
			})

			this.props.onSubmit(comment)
		}
	}

	render() {
		const { message, mentions } = this.state

		return (
			<div className={css({ padding: 10 })}>
				<h2>Comment</h2>
				<MessageEditor
					message={message}
					mentions={mentions}
					mentionOptions={mentionOptions}
					placeholder="Mention teammates with @name"
					onStateChange={this.handleChange}
				/>
				<Button
					className={css({ marginTop: '16px' })}
					onClick={this.handleSubmit}
				>
					Send
				</Button>
			</div>
		)
	}
}

CommentEditor.propTypes = {
	onSubmit: PropTypes.func.isRequired
}

export default CommentEditor
