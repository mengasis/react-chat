import React from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'
import Comment from './Comment'

const List = styled('ul')`
	list-style: none;
	margin: 0;
	margin-bottom: 64px;
	padding: 0;
`

const ListItem = styled('li')`
	margin-bottom: 32px;
`

const CommentsList = ({ comments }) => (
	<List>
		{comments.map(({ message, mentions }, index) => (
			<ListItem key={index}>
				<Comment message={message} mentions={mentions} />
			</ListItem>
		))}
	</List>
)

CommentsList.propTypes = {
	comments: PropTypes.array
}

export default CommentsList
