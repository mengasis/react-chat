import { createReducer, createSelector } from 'redux-starter-kit'
import { combineReducers } from 'redux'

import { addComment } from '../actions'

const getInitialComments = () => [
	{
		message: 'It\'s been a hard day\'s night',
		mentions: []
	},
	{
		message: 'Ringo Starr you can drive my car.',
		mentions: [
			{
				id: '4',
				length: 11,
				name: 'Ringo Starr',
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
