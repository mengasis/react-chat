import PropTypes from 'prop-types'
import styled, { css } from 'react-emotion'

const border = props =>
	!props.borderless &&
	css`
		box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.2);
		border-radius: 4px;
	`

const Menu = styled('ul')`
	background-color: #fff;
	margin: 0;
	padding: ${props => (props.compact ? '8px' : '24px')};
	list-style: none;
	min-width: ${props => (props.minWidth ? props.minWidth : 'auto')};

	${border};
`

Menu.propTypes = {
	minWidth: PropTypes.string,
	compact: PropTypes.bool,
	borderless: PropTypes.bool,
	children: PropTypes.node
}

export default Menu
