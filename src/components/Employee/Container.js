import styled from 'styled-components'

export default styled('div')`
	margin: 25px;
	background: rgba(37, 43, 50, 1);
	box-shadow: 1px 3px 8px rgba(32, 32, 32, 0.05);

	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 25px;
	border-radius: 5px;

	.right {
		display: flex;
		align-items: center;
	}

	.wait-time {
		h1 {
			font-weight: 100;
			margin: 0;
			font-size: 24px;
		}

		span.highlight {
			color: rgba(237, 209, 129, 1);
		}
	}

	.person {
		font-size: 40px;
		font-weight: 700;
	}

	button {
		border: 0;
		border-radius: 3px;
		padding: 20px 50px;
		font-size: 22px;
		background: rgba(242, 209, 116, 1);
		color: black;
		box-shadow: 2px 3px 3px rgba(32, 32, 32, 0.3);
	}
`
