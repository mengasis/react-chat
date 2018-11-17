import styled from 'react-emotion'
import { inputStyle } from './FormStyles'

export default styled('div')`
	${inputStyle} position: absolute;
	top: 0;
	bottom: 0;
	white-space: pre-wrap;
	word-break: break-word;
	color: transparent;
	border: none;
	padding-right: 24px;

	span {
		background-color: #23cca44c;
		border-radius: 2px;
	}
`
