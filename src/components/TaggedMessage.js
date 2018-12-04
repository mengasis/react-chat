import React from 'react'
import styled from 'react-emotion'
import PropTypes from 'prop-types'

const Tag = styled('span')`
	display: inline-block;
	background-color: #23cca44c;
	border-radius: 2px;
	font-weight: 400;
	padding: 0 4px;
	margin: 0 2px;
	box-shadow: 0 0 2px 0 #1eb18f;
`

const TaggedMessage = ({ message, mentions }) => {
	let currentPos = 0
	let fragments = []

	for (let i = 0; i < mentions.length; i++) {
		fragments.push({
			text: message.substring(currentPos, mentions[i].offset),
			isMention: false
		})
		fragments.push({
			text: mentions[i].name,
			isMention: true
		})
		currentPos = mentions[i].offset + mentions[i].length
	}

	fragments.push({
		text: message.substring(currentPos),
		isMention: false
	})

	return (
		<>
			{fragments.map(
				(fragment, index) =>
					fragment.isMention ? (
						<Tag key={index}>{fragment.text}</Tag>
					) : (
						<React.Fragment key={index}>{fragment.text}</React.Fragment>
					)
			)}
		</>
	)
}

TaggedMessage.propTypes = {
	message: PropTypes.string.isRequired,
	mentions: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string.isRequired,
			offset: PropTypes.number.isRequired,
			length: PropTypes.number.isRequired
		})
	)
}

export default TaggedMessage
