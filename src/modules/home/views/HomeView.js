import React from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"

const Wrapper = styled("div")`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;

	h1 {
		font-family: marguerite;
		line-height: 1.5;
		font-size: 80px;
	}

	h4 {
		font-size: 40px;
		font-weight: 100;
	}

	.inner {
		text-align: center;
	}

	.or-container {
		text-align: center;
		align-self: center;
		width: 50px;
		background: red;
	}

	.or {
		font-size: 22px;
		color: white;
		width: 100%;

		
	}

	.pin {
		font-size: 22px;
		color: white;
		margin-bottom: 6vh;
	}
`

const Button = styled("div")`
	margin-top: 15vh;
	margin-bottom: 7vh;

	font-size: 42px;
	padding: 50px 300px;
	background: #473cd1;
	border-radius: 5px;
	cursor: pointer;
	color: white;
`

const StyledLink = styled(Link)`
	text-decoration: none;
	&:focus,
	&:hover,
	&:visited,
	&:link,
	&:active {
		text-decoration: none;
	}
`

const HomeView = () => {
	return (
		<Wrapper>
			<div className="inner">
				<h1>Lorenzo's</h1>

				<StyledLink to="/sign-in">
					<Button>Sign In Here</Button>
				</StyledLink>

				<h4>Estimated Wait Time: 1h 30m</h4>
			</div>
		</Wrapper>
	)
}

export default HomeView
