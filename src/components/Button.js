import React from "react"
import styled from "styled-components"

const StyledBtn = styled("button")`
	border: 0;
	font-size: 42px;
	padding: 2vh 10vw;
	background: #473cd1;
	border-radius: 5px;
	cursor: pointer;
	color: white;
	opacity: 1;
	transition: opacity: 1s ease;

	&:disabled {
	transition: opacity: 1s ease;

		cursor: not-allowed;
		opacity: 0.2;
	}
`


const Button = props => {
	return <StyledBtn {...props}>{props.children}</StyledBtn>
}

export default Button
