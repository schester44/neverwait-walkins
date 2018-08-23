import React from "react"
import styled, { keyframes } from "styled-components"
import { onlyUpdateForKeys } from "recompose"

const grow = keyframes`
	from {
		transform: scale(1.1);
	}

	to {
		transform: scale(1);
	}
`

const Container = styled("div")`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: calc(50% - 40px);
	height: 150px;
	background: rgba(115, 117, 128, 1);
    margin: 10px;
    padding: 20px;
	transition: all 0.2s ease;
	border-radius: 15px;
	color: rgba(234, 232, 237, 1);
	box-shadow: 1px 2px 5px rgba(32, 32, 32, 1);
	
	h1 {
		font-weight: 500 !important;
	}

	p {
		opacity: 0.5;
		margin-top: 5px;
	}

	${props =>
		props.selected &&
		`
		animation: ${grow} .5s ease;
		color: rgba(42, 66, 89, 1.0);
		background: rgba(105, 180, 243, 1.0);
		box-shadow: 1px 5px 10px rgba(32,32,32,1);

		h1 {
			font-weight: 100;
		}
	`};
`

const ServiceCard = ({ selected, service, onClick }) => {
	return (
		<Container onClick={onClick} selected={selected}>
			<h1>{service.name.split('+').join(`\n+`)}</h1>
			<p>
				${service.price || 0} {service.duration > 0 && `- ${service.duration} minutes`}
			</p>
		</Container>
	)
}

export default onlyUpdateForKeys(["selected"])(ServiceCard)
