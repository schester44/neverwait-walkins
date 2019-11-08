import styled, { css } from 'styled-components'

const firstAvailableStyles = ({ firstAvailable }) =>
	firstAvailable &&
	css`
		background: rgba(47, 53, 60, 1);

		.wait-time--highlight {
			color: rgba(144, 195, 85, 1.0);
		}

		button {
			background: rgba(144, 195, 85, 1.0);
			color: white;
		}
	`

export default styled('div')`
	margin-bottom: 24px;
	background: rgba(37, 43, 50, 1);
	box-shadow: 1px 3px 8px rgba(32, 32, 32, 0.05);
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 25px;
	border-radius: 5px;

	.avatar {
		width: 48px;
		height: 48px;
		border-radius: 8px;
		background: rgba(57, 63, 70, 1);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32px;
		color: rgba(26, 30, 32, 1);
		margin-right: 16px;
	}

	.left {
		display: flex;
		align-items: center;
	}

	.right {
		display: flex;
		align-items: center;
	}

	.wait-time {
		&--title {
			font-size: 20px;
			opacity: 0.3;
			text-transform: uppercase;
			letter-spacing: 1px;
		}

		&--highlight {
			margin-top: 4px;
			color: rgba(237, 209, 129, 1);
			font-size: 40px;
		}

		&.first-available {
			&--highlight {
				font-size: 28px;
			}
		}
	}

	.person {
		display: flex;
		align-items: center;
		font-size: 40px;
		font-weight: 700;
		margin-bottom: 8px;

		&.has-wait {
			margin-bottom: 16px;
		}
	}

	button {
		border: 0;
		border-radius: 3px;
		padding: 16px 26px;
		font-size: 22px;
		background: rgba(242, 209, 116, 1);
		color: black;
		box-shadow: 2px 3px 3px rgba(32, 32, 32, 0.3);
	}

	${firstAvailableStyles};
`
