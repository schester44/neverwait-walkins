import React from "react"
import styled, { keyframes } from "styled-components"

import Service from "./ServiceCard"

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
		padding: 20px 0;
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
								service={service}
								selected={selectedService === service.id}
							/>
						)
					})}
				</div>
			</div>
		</Wrapper>
	)
}

export default ServiceSelector
