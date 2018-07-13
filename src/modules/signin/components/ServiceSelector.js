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
	height: 100%;

	.heading {
		text-align: center;
		padding: 50px 0;

		h1 {
			font-weight: 100;
		}
	}

	.list {
		width: 90%;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.buttons {
		width: 80%;
	}

	.back-btn {
		width: 100%;
		margin: 10px auto 50px auto;
		padding: 30px 10px;
		border: 0;
		border: 1px solid rgba(32, 32, 32, 0.2);
		border-radius: 50px;
		color: rgba(32, 32, 32, 0.2);
		font-size: 32px;
		outline: none;
		text-align: center;
	}

	.next-btn {
		width: 100%;
		margin: 50px auto 15px auto;
		padding: 30px 10px;
		border: 0;
		background: rgba(247, 107, 97, 1);
		border-radius: 50px;
		color: white;
		font-size: 32px;
		outline: none;
		text-align: center;
	}
`

const Service = styled("div")`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: calc(50% - 40px);
	height: 200px;
	background: rgba(32, 32, 32, 0.2);
	margin: 10px;
	transition: all 0.2s ease;
	border-radius: 15px;

	p {
		opacity: 0.5;
		margin-top: 5px;
	}

	${props =>
		props.selected &&
		`
		animation: ${grow} .5s ease;
		background: rgba(32,32,32, 0.5);
		box-shadow: 0px 5px 10px rgba(32,32,32,0.1);
	`};
`

const NextBtn = styled("div")`
	position: relative;
	width: 100%;
	margin: 50px auto 15px auto;
	padding: 30px 10px;
	border: 0;
	background: rgba(247, 107, 97, 1);
	border-radius: 50px;
	color: white;
	font-size: 32px;
	outline: none;
	text-align: center;
	text-transform: uppercase;

	${props =>
		props.disabled &&
		`
		filter: blur(3px);
	`};
`

const ServiceSelector = ({ selectedService, services, disabled, onSelect, onNextBtnClick, onBackBtnClick }) => {
	return (
		<Wrapper>
			<div className="heading">
				<h1>SELECT A SERVICE</h1>
			</div>

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

			<div className="buttons">
				<NextBtn
					onClick={() => {
						if (!disabled) {
							onNextBtnClick()
						}
					}}
					disabled={disabled}
				>
					Next
				</NextBtn>
				<div className="back-btn" onClick={onBackBtnClick}>
					BACK
				</div>
			</div>
		</Wrapper>
	)
}

export default ServiceSelector
