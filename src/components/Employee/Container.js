import styled from "styled-components"

export default styled("div")`
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
		margin-right: 25px;
		text-align: right;

		h1 {
			font-weight: 100;
			margin: 0;
		}

		p {
			opacity: 0.5;
			font-weight: 100;
			line-height: 0.8;
			margin: 0;
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
		background: rgba(242, 209, 116, 1.0);
		color: black;
	}
`
