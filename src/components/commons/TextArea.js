import styled from 'react-emotion'
import TextareaAutosize from 'react-autosize-textarea'
import { inputStyle } from './FormStyles'

export default styled(TextareaAutosize)`
	${inputStyle} position: relative;
	background: transparent;
	border: none;
	resize: none;
	padding-right: 24px;
`
