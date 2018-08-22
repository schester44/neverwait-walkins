import React from "react"
import styled, { keyframes } from "styled-components"

const grow = keyframes`
	from {
		transform: scale(1.1);
	}

	to {
		transform: scale(1);
	}
`

const Wrapper = styled("div")`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	flex: 1;
	padding-top: 50px;

	h1 {
		margin: 20px 0;
		font-weight: 100;
		text-align: center;
	}

	.form {
		width: 90%;
		background: rgba(69, 69, 82, 1);
		padding: 20px 40px;
		border-radius: 5px;
		box-shadow: 0px 2px 10px rgba(32, 32, 32, 0.5);

		.list {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
		}
	}

	.buttons {
		width: 80%;
	}
`

const Service = styled("div")`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: calc(50% - 40px);
	height: 200px;
	background: rgba(115, 117, 128, 1);
	margin: 10px;
	transition: all 0.2s ease;
	border-radius: 15px;
	color: rgba(234, 232, 237, 1);
	box-shadow: 1px 2px 5px rgba(32, 32, 32, 1);

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
		box-shadow: 1px 5px 10px rgba(32,32,32,1ƒ);
	`};
`

const ServiceSelector = ({ selectedService, services, onSelect }) => {
	return (
		<Wrapper>
			<div className="form">
				<h1>SELECT A SERVICE</h1>
				<div className="list">
					{services.map(service => {
						return (
							<Service
								key={`service-${service.id}`}
								onClick={() => onSelect(service)}
								selected={selectedService === service.id}
							>
								<h1>{service.name}</h1>
								<p>
									${service.price || 0} {service.duration > 0 && `- ${service.duration} minutes`}
								</p>
							</Service>
						)
					})}
				</div>
			</div>
		</Wrapper>
	)
}

export default ServiceSelector
