import { css } from 'react-emotion'

export const focusStyle = {
	outline: 'none',
	borderColor: '#23cca4'
}

export const disabledStyle = {
	cursor: 'not-allowed',
	opacity: 0.25
}

export const inputStyle = css`
	display: block;
	width: 100%;
	padding: 8px 10px;
	margin: 0;
	appearance: none;
	font-family: inherit;
	font-size: 16px;
	line-height: 1.25;
	color: inherit;
	background-color: #fff;
	border-radius: 4px;
	border-width: 1px;
	border-style: solid;
	border-color: #d2d7e0;
	transition: border-color 0.15s ease-in;

	::placeholder {
		opacity: 1;
		color: #9ba1b0;
	}

	::-ms-clear {
		display: none;
	}

	&:focus {
		${focusStyle};
	}

	&:disabled {
		${disabledStyle};
	}
`
