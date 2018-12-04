import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'react-emotion'

const ellipsis = css`
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
`

const itemStyle = props => {
	let style = {
		display: 'flex',
		alignItems: 'center',
		background: 'none',
		border: 'none',
		color: '#2b3039',
		padding: '4px',
		lineHeight: 1.5,
		fontSize: '14px',
		width: '100%',
		whiteSpace: 'nowrap',
		cursor: 'pointer',

		'&:hover': {
			backgroundColor: '#ebedf2',
			textDecoration: 'none'
		}
	}

	if (props.selected) {
		style.fontWeight = 400
		style.backgroundColor = '#def8f2'
	}

	if (props.highlighted) {
		style.backgroundColor = '#ebedf2'
	}

	if (props.disabled) {
		style.opacity = 0.5
		style.cursor = 'not-allowed'

		style['&:hover'].backgroundColor = 'transparent'
	}

	return style
}

const MenuItemButton = styled('button')(itemStyle)
const MenuItemLink = styled('a')(itemStyle)

const MenuItemContent = ({ to, ...props }) => {
	return to ? <MenuItemLink href={to} {...props} /> : <MenuItemButton {...props} />
}

const MenuItem = ({ to, addon, selected, highlighted, disabled, children, ...props }) => {
	return (
		<li>
			<MenuItemContent
				to={to}
				selected={selected}
				highlighted={highlighted}
				disabled={disabled}
				{...props}
			>
				<div className={ellipsis}>{children}</div>
			</MenuItemContent>
		</li>
	)
}

MenuItemContent.propTypes = {
	to: PropTypes.string
}

MenuItem.propTypes = {
	to: PropTypes.string,
	addon: PropTypes.node,
	selected: PropTypes.bool,
	highlighted: PropTypes.bool,
	disabled: PropTypes.bool,
	children: PropTypes.node
}

export default MenuItem
