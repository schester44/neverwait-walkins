import React from "react"
import styled from "styled-components"

const StyledBtn = styled("button")`
		width: 100%;
		padding: 30px 10px;
		border: 0;
		background: rgba(97, 178, 249, 1.0);
		border-radius: 5px;
		color: white;
		font-size: 32px;

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
