import React from "react"
import styled from "styled-components"

const Wrapper = styled("div")`
    width: 100%;
    text-align: left;
    
    label {
        text-transform: uppercase;
        color: #473cd1;
        font-size: 22px;
        font-weight: 700;
    }

    input {
        font-size: 32px;
        border: 0;
        margin-top: 10px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 5px;
        width: 100%;
        padding: 20px;
        font-weight: 400;
        outline: none;
        color: white;
    }
`

const Input = props => {
	return (
		<Wrapper>
			{props.label && <label>{props.label}</label>}
			<input {...props} />
		</Wrapper>
	)
}

export default Input
