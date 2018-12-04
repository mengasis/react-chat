import { createReducer, createSelector } from 'redux-starter-kit'
import { combineReducers } from 'redux'

import { addComment } from '../actions'

const getInitialComments = () => [
	{
		message: 'It\'s been a hard day\'s night',
		mentions: []
	},
	{
		message: 'Julius Caesar can you drive my horse?',
		mentions: [
			{
				id: '5',
				length: 13,
				name: 'Julius Caesar',
				offset: 0
			}
		]
	}
]

const comments = createReducer(getInitialComments(), {
	[addComment]: (state, action) => {
		const newComment = action.payload
		state.push(newComment)
	}
})

export default combineReducers({
	comments
})

export const getComments = createSelector(['comments'])
