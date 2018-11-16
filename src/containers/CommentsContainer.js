import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addComment } from '../actions'
import { getComments } from '../reducers'
import { Pane } from '../components/Pane'
import { CommentsList } from '../components/CommentsList'

const CommentsContainer = ({ comments, addComment }) => (
	<>
		<h1>Chat</h1>
		<Pane>
			<CommentsList comments={comments} />
		</Pane>
	</>
)

CommentsContainer.propTypes = {
	comments: PropTypes.arrayOf(
		PropTypes.shape({
			message: PropTypes.string.isRequired,
			mentions: PropTypes.array.isRequired
		})
	).isRequired,
	addComment: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
	comments: getComments(state)
})

export default connect(
	mapStateToProps,
	{ addComment }
)(CommentsContainer)
