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
	border-radius: 5px;
	color: rgba(255, 255, 255, 1);
	box-shadow: inset -1px -1px 5px rgba(255, 255, 255, 0.5);

	// TODO: Where are these being overwritten from
	h1 {
		font-weight: 500 !important;
		line-height: 1 !important;
		margin-bottom: 10px !important;
		text-shadow: 1px 1px 0px rgba(32, 32, 32, 0.2);
	}

	p {
		opacity: 0.5;
		margin-top: 5px;
	}

	${props =>
		props.selected &&
		`
		animation: ${grow} .5s ease forwards;
		background: rgba(244, 37, 49, 1.0);

		h1 {
			font-weight: 100;
		}

		p {
			color: white;
			opacity: 0.8;
		}
	`};
`

const ServiceCard = ({ selected, service, onClick }) => {
	return (
		<Container onClick={onClick} selected={selected}>
			<h1>{service.name.split("+").join(`\n+`)}</h1>

			{service.duration > 0 && <p>{service.duration} minutes</p>}
			<p>${service.price || 0}</p>
		</Container>
	)
}

export default onlyUpdateForKeys(["selected"])(ServiceCard)
