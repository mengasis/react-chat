import React from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'
import { Comment } from './Comment'

export const List = styled('ul')`
	list-style: none;
	margin: 0;
	margin-bottom: 64px;
	padding: 0;
`

export const ListItem = styled('li')`
	margin-bottom: 32px;
`

export const CommentsList = ({ comments }) => (
	<List>
		{comments.map((comment, index) => (
			<ListItem key={index}>
				<Comment message={comment.message} mentions={comment.mentions} />
			</ListItem>
		))}
	</List>
)

CommentsList.propTypes = {
	comments: PropTypes.array
}
