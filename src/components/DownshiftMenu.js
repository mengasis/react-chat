import React from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'
import matchSorter from 'match-sorter'

import Menu from './Menu'
import MenuItem from './MenuItem'

const DisabledMessage = styled('div')`
	background: #f7f8fa;
	border-radius: 2px;
	font-size: 12px;
	margin-bottom: 2px;
	padding: 8px;
	text-align: center;
`

const DownshiftMenu = ({
	items,
	filter,
	isOpen,
	highlightedIndex,
	selectedItem,
	getMenuProps,
	getItemProps,
	minWidth,
	disabledMessage
}) => {
	const getItems = items => {
		if (typeof filter === 'function') {
			return filter(items)
		}
		if (typeof filter === 'object') {
			return filter.query
				? matchSorter(items, filter.query, {
					keys: filter.keys
				  })
				: items
		}
		return items
	}

	let someAreDisabled = false

	items.forEach(item => {
		if (item.disabled) {
			someAreDisabled = true
		}
	})

	return (
		<Menu {...getMenuProps({ hidden: !isOpen, compact: true, minWidth })}>
			{someAreDisabled &&
				disabledMessage && <DisabledMessage>{disabledMessage}</DisabledMessage>}
			{isOpen
				? getItems(items).map((item, index) => {
					return (
					// eslint-disable-next-line react/jsx-key
						<MenuItem
							{...getItemProps({
								key: item.id,
								index,
								item,
								highlighted: highlightedIndex === index,
								selected: selectedItem === item,
								disabled: item.disabled
							})}
						>
							{item.name}
						</MenuItem>
					)
				  })
				: null}
		</Menu>
	)
}

export const itemType = PropTypes.shape({
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	picture: PropTypes.string,
	name: PropTypes.string.isRequired,
	initials: PropTypes.string,
	disabled: PropTypes.bool,
	description: PropTypes.string
})

export const itemsArrayType = PropTypes.arrayOf(itemType)

DownshiftMenu.propTypes = {
	items: itemsArrayType.isRequired,
	filter: PropTypes.oneOfType([
		PropTypes.shape({
			query: PropTypes.string,
			keys: PropTypes.array
		}),
		PropTypes.func
	]),
	isOpen: PropTypes.bool.isRequired,
	highlightedIndex: PropTypes.number.isRequired,
	selectedItem: itemType,
	getMenuProps: PropTypes.func.isRequired,
	getItemProps: PropTypes.func.isRequired,
	minWidth: Menu.propTypes.minWidth,
	disabledMessage: PropTypes.string
}

export default DownshiftMenu
