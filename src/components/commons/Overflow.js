import styled from 'react-emotion'
import { inputStyle, focusStyle } from './FormStyles'

export default styled('div')`
	${inputStyle} width: auto;
	max-height: ${props => props.maxHeight};
	overflow-x: hidden;
	overflow-y: scroll;
	padding: 0;

	&:focus-within {
		${focusStyle};
	}
`
