import React from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'

import { TaggedMessage } from './TaggedMessage'

export const Bubble = styled('div')`
	background: #f7f8fa;
	border-radius: 4px;
	box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2);
	font-size: 16px;
	padding: 8px;
`

export const Comment = ({ message, mentions }) => (
	<Bubble>
		<TaggedMessage message={message} mentions={mentions} />
	</Bubble>
)

Comment.propTypes = {
	message: PropTypes.string,
	mentions: PropTypes.array
}
