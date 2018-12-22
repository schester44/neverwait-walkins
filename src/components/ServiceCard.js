import React from "react"
import styled from "styled-components"

const Container = styled("div")`
	position: relative;
	margin: 10px;
	background: rgba(37, 43, 50, 1);
	box-shadow: 1px 3px 8px rgba(32, 32, 32, 0.05);
	padding: 25px;
	border-radius: 5px;
	width: calc(50% - 20px);
	padding-left: 60px;
	display: flex;
	align-items: center;
	max-height: 150px;

	${({ selected }) =>
		selected &&
		`
		color: rgba(237, 209, 129, 1.0);

	&:before {
		position: absolute;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		border: 2px solid rgba(237, 209, 129, 1.0);
		z-index: 99;
		top: calc(50% - 11px);
		left: 18px;
		content: "";
	}

	&:after {
		position: absolute;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: rgba(237, 209, 129, 1.0);
		z-index: 99;
		top: calc(50% - 6px);
		left: 23px;
		content: "";
	}
	`}

	h1 {
		line-height: 1;
	}

	p {
		font-size: 22px;
		padding-top: 5px;
		opacity: 0.5;
	}
`

const ServiceCard = ({ selected, service, onClick }) => {
	return (
		<Container selected={selected} onClick={onClick}>
			<div>
				<h1>{service.name}</h1>
				<p>
					${service.price || 0} - {service.duration > 0 && <span>{service.duration} minutes</span>}
				</p>
			</div>
		</Container>
	)
}

export default ServiceCard
