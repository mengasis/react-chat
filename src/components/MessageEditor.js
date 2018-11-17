import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Downshift from 'downshift'
import matchSorter from 'match-sorter'

import {
	getCaretPosition,
	getMentionQueryAtCaret,
	updateMentions,
	replaceMentionQuery,
	createMention,
	setCaretPosition,
	getTaggedMessage
} from '../utils/mentionHelpers'

import DownshiftMenu, { itemsArrayType } from './DownshiftMenu'
import Popover from './Popover'

import Overflow from './commons/Overflow'
import TextareaBackground from './commons/TextAreaBackground'
import Textarea from './commons/TextArea'
import Relative from './commons/Relative'
import Absolute from './commons/Absolute'

class MessageEditor extends Component {
	constructor(props) {
		super(props)

		this.defaultState = {
			inputValue: '',
			isOpen: false,
			selectedItem: null,
			highlightedIndex: 0,
			mentions: [],
			mentionQuery: null,
			caretPosition: 0
		}

		this.state = {
			...this.defaultState,
			inputValue: props.message,
			mentions: props.mentions
		}

		this.inputRef = React.createRef()
	}

	componentDidUpdate(prevProps, prevState) {
		// Override internal state if controlled props differ
		if (
			this.props.message !== prevProps.message &&
			this.props.message !== this.state.inputValue
		) {
			this.setState({ inputValue: this.props.message })
		}

		if (
			this.props.mentions !== prevProps.mentions &&
			this.props.mentions !== this.state.mentions
		) {
			this.setState({ mentions: this.props.mentions })
		}

		// Notify relevant state change to parent
		const changes = {}

		if (this.state.inputValue !== prevState.inputValue) {
			changes.message = this.state.inputValue
		}

		if (this.state.mentions !== prevState.mentions) {
			changes.mentions = this.state.mentions
		}

		if (Object.keys(changes).length > 0) {
			this.props.onStateChange(changes)
		}
	}

	updateInputValue(inputValue, caretPos, cb) {
		const caretPosition = caretPos || getCaretPosition(this.inputRef.current.textarea)
		// Consider using react-input-trigger if more advanced cases needed
		// https://github.com/abinavseelan/react-input-trigger
		const mentionQuery = getMentionQueryAtCaret(inputValue, caretPosition)
		const mentions = updateMentions(this.state.mentions, inputValue)

		this.setState(
			{
				inputValue,
				isOpen: mentionQuery !== null,
				mentionQuery,
				caretPosition,
				mentions
			},
			() => {
				if (cb) cb()
			}
		)
	}

	updateCaretPosition = () => {
		const caretPosition = getCaretPosition(this.inputRef.current.textarea)
		this.setState({ caretPosition })
	}

	handleInputChange = event => {
		// We're using React's own onChange event for the input instead of
		// Downshift's onInputValueChange because the latter emits on Escape and Blur
		// events with an empty string value and we don't want to change the inputValue
		// on those events.
		this.updateInputValue(event.target.value)
	}

	handleStateChange = changes => {
		switch (changes.type) {
		case Downshift.stateChangeTypes.changeInput:
			break // do nothing, already handled on InputValueChange
		case Downshift.stateChangeTypes.controlledPropUpdatedSelectedItem:
			break // do nothing, already handled on KeyDownEnter and ClickItem events
		case Downshift.stateChangeTypes.keyDownEnter:
		case Downshift.stateChangeTypes.clickItem: {
			// Replace mention query in message with mention name
			const inputValue = replaceMentionQuery(
				this.state.inputValue,
				this.state.mentionQuery,
				changes.selectedItem.name
			)

			const caretPosition =
					this.state.mentionQuery.index + changes.selectedItem.name.length

			// Add mention to mentions array
			let mentions = [
				...this.state.mentions,
				createMention(changes.selectedItem, this.state.mentionQuery.index)
			]

			// Sort mentions by offset and update
			mentions = _.sortBy(mentions, 'offset')
			mentions = updateMentions(mentions, inputValue)

			this.setState(
				{
					...changes,
					inputValue,
					caretPosition,
					selectedItem: null, // we're not interested in persisting selection
					mentions
				},
				() => {
					// Update caret position after new replaced mention
					setCaretPosition(this.inputRef.current.textarea, caretPosition)
				}
			)

			break
		}
		case Downshift.stateChangeTypes.keyDownEscape:
		case Downshift.stateChangeTypes.blurInput:
		case Downshift.stateChangeTypes.mouseUp: {
			this.setState({
				...changes,
				inputValue: this.state.inputValue // We don't want to reset inputValue
			})
			break
		}
		default: {
			this.setState(changes)
		}
		}
	}

	handleSelectEmoji(emoji) {
		const { inputValue, caretPosition } = this.state

		const newInputValue = [
			inputValue.slice(0, caretPosition),
			emoji,
			inputValue.slice(caretPosition)
		].join('')

		const newCaretPosition = caretPosition + emoji.length

		this.updateInputValue(newInputValue, newCaretPosition, () => {
			// Update caret position after inserting emoji
			setCaretPosition(this.inputRef.current.textarea, newCaretPosition)
		})
	}

	handleKeyDown = event => {
		if (!this.state.isOpen) {
			// Prevent Downshift default handler so that user can move caret inside textarea
			if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
				event.nativeEvent.preventDownshiftDefault = true
			}
			// Allow submitting comment on enter if enabled
			if (this.props.submitOnEnter) {
				if (event.key === 'Enter' && !event.shiftKey) {
					event.preventDefault()
					this.submit()
				}
			}
		}
	}

	handleResize = () => {
		this.props.onResize()
	}

	submit() {
		this.props.onSubmit({
			message: this.state.inputValue,
			mentions: this.state.mentions
		})

		this.setState(this.defaultState)
	}

	render() {
		const {
			mentionOptions,
			placeholder,
			maxHeight,
			minHeight,
			menuPlacement = 'top-start',
			disabled,
			disabledMessage
		} = this.props

		const mentionsOptionsFilter = items => {
			const query = this.state.mentionQuery
			const itemsSortedByQuery = query
				? matchSorter(items, query.text, { keys: ['name'] })
				: items
			const notMentioned = item => !this.state.mentions.find(m => m.id === item.id)
			return itemsSortedByQuery.filter(notMentioned)
		}

		return (
			<Downshift
				inputValue={this.state.inputValue}
				isOpen={this.state.isOpen}
				selectedItem={this.state.selectedItem}
				highlightedIndex={this.state.highlightedIndex}
				onStateChange={this.handleStateChange}
				itemToString={item => (item ? item.name : '')}
				defaultHighlightedIndex={0}
			>
				{({
					getInputProps,
					getItemProps,
					getMenuProps,
					isOpen,
					inputValue,
					highlightedIndex
				}) => (
					<div>
						<Popover
							isVisible={isOpen}
							placement={menuPlacement}
							closeOnScroll={true}
							handler={
								<Overflow maxHeight={maxHeight}>
									<Relative>
										<TextareaBackground
											style={{ minHeight: minHeight || 'auto' }}
											dangerouslySetInnerHTML={getTaggedMessage(
												inputValue,
												this.state.mentions
											)}
										/>
										<Textarea
											{...getInputProps({
												innerRef: this.inputRef,
												onChange: this.handleInputChange,
												onKeyDown: this.handleKeyDown,
												onResize: this.handleResize,
												placeholder: placeholder,
												disabled: disabled,
												style: { minHeight: minHeight || 'auto' }
											})}
										/>
									</Relative>
								</Overflow>
							}
						>
							{({ placement }) => {
								const position =
									placement === 'bottom-start' ? 'top' : 'bottom'
								console.log(position)
								return (
									// Relative + height is necessary for smart placement.
									// Absolute is necessary for keeping menu snapped to edge
									// after it resizes due to filtering.
									<Relative style={{ height: '200px' }}>
										<Absolute style={{ [position]: 0 }}>
											<DownshiftMenu
												items={mentionOptions}
												menuType="profile"
												filter={mentionsOptionsFilter}
												isOpen={isOpen}
												highlightedIndex={highlightedIndex}
												getMenuProps={getMenuProps}
												getItemProps={getItemProps}
												disabledMessage={disabledMessage}
												minWidth="300px"
											/>
										</Absolute>
									</Relative>
								)
							}}
						</Popover>
					</div>
				)}
			</Downshift>
		)
	}
}

MessageEditor.propTypes = {
	message: PropTypes.string.isRequired,
	mentions: PropTypes.array.isRequired,
	mentionOptions: itemsArrayType.isRequired,
	placeholder: PropTypes.string,
	maxHeight: PropTypes.string,
	minHeight: PropTypes.string,
	menuPlacement: PropTypes.oneOf(['top-start', 'bottom-start']),
	disabled: PropTypes.bool,
	disabledMessage: PropTypes.string,
	submitOnEnter: PropTypes.bool,
	onResize: PropTypes.func,
	onStateChange: PropTypes.func,
	onSubmit: PropTypes.func.isRequired
}

MessageEditor.defaultProps = {
	message: '',
	mentions: [],
	placeholder: 'Mention with @name',
	maxHeight: `${5 * 24.5}px`,
	disabled: false,
	submitOnEnter: false,
	onResize: () => {},
	onStateChange: () => {},
	onSubmit: () => {}
}

export default MessageEditor

