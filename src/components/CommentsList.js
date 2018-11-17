import React from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'
import Comment from './Comment'

const List = styled('ul')`
	list-style: none;
	margin: 0;
	padding: 10px;
	overflow-y: auto;
	height: 300px;
	border: 1px solid #d2d7e0;
	background: #f6fffd;
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
