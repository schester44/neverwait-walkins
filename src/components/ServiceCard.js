import React from 'react'
import styled, { css } from 'styled-components'
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io'

const Container = styled('div')`
	position: relative;
	margin: 5px;
	background: rgba(37, 43, 50, 1);
	box-shadow: 1px 3px 8px rgba(32, 32, 32, 0.05);
	padding: 25px;
	border-radius: 5px;
	width: calc(50% - 10px);
	padding-left: 60px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	max-height: 150px;

	.quantity {
		padding: 10px;
		position: absolute;
		background: rgba(37, 43, 50, 1);
		top: 0;
		right: 0;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		color: white;
	}

	.quantity-title {
		padding: 4px;
		font-size: 12px;
		opacity: 0.4;
		margin-bottom: 4px;
	}

	.quantity-btn {
		width: 60px;

		.up {
			border-top-left-radius: 8px;
			border-top-right-radius: 8px;
			border: 1px solid rgba(26, 30, 33, 1);
			height: 40px;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 24px;
			cursor: pointer;
		}
		.count {
			font-size: 18px;
			display: flex;
			align-items: center;
			justify-content: center;
			border-left: 1px solid rgba(26, 30, 33, 1);
			border-right: 1px solid rgba(26, 30, 33, 1);
			height: 24px;
			background: rgba(26, 30, 33, 1);
		}

		.down {
			border-bottom-left-radius: 8px;
			border-bottom-right-radius: 8px;
			border: 1px solid rgba(26, 30, 33, 1);
			height: 40px;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 24px;
			cursor: pointer;
		}
	}

	&:before {
		position: absolute;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		border: 2px solid rgba(237, 209, 129, 1);
		z-index: 99;
		top: calc(50% - 11px);
		left: 18px;
		content: '';
	}

	${({ selected }) =>
		selected &&
		css`
			color: rgba(237, 209, 129, 1);

			&:after {
				position: absolute;
				width: 16px;
				height: 16px;
				border-radius: 50%;
				background: rgba(237, 209, 129, 1);
				z-index: 99;
				top: calc(50% - 6px);
				left: 23px;
				content: '';
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

const ServiceCard = ({ quantity, selected, service, onClick, onIncreaseQuantity, onDecreaseQuantity }) => {
	return (
		<Container selected={selected} onClick={onClick}>
			<div>
				<h1>{service.name}</h1>
				<p>
					${service.sources[0].price || 0}{' '}
					{service.sources[0].duration > 0 && <span> - {service.sources[0].duration} minutes</span>}
				</p>
			</div>

			{selected && (
				<div className="quantity">
					<span className="quantity-title">Quantity</span>

					<div className="quantity-btn">
						<div
							className="up"
							onClick={e => {
								e.stopPropagation()
								onIncreaseQuantity()
							}}
						>
							<IoIosArrowUp />
						</div>

						<div className="count">{quantity}</div>

						<div
							className="down"
							onClick={e => {
								e.stopPropagation()
								onDecreaseQuantity()
							}}
						>
							<IoIosArrowDown />
						</div>
					</div>
				</div>
			)}
		</Container>
	)
}

export default ServiceCard
