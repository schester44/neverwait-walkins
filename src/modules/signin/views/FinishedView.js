import React, { PureComponent } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import AppHeader from "../../../components/AppHeader"

const Wrapper = styled("div")`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
`

const Content = styled("div")`
	width: 80vw;
	height: 80vh;
	text-align: center;
	color: #7b808b;
	margin-top: 3vh;

	.time {
		color: white;
		font-weight: 700;
	}

	h1 {
		font-size: 80px;
	}

	p {
		line-height: 1.5;
		text-align: left;
		margin-top: 25px;
		font-size: 32px;
	}
`

const Button = styled("button")`
	margin-top: 5vh;

	border: 0;
	font-size: 42px;
	padding: 50px 300px;
	background: #473cd1;
	border-radius: 5px;
	cursor: pointer;
	color: white;
`

class Finished extends PureComponent {
	componentDidMount() {
		this.timer = window.setTimeout(() => {
			this.props.history.push('/')
		}, 15000)
	}

	componentWillUnmount() {
		if (this.timer) {
			window.clearTimeout(this.timer)
		}
	}

	render() {
		return (
			<Wrapper>
				<AppHeader />

				<Content>
					<h1>You're all set!</h1>

					<p style={{ textAlign: "center" }}>
						You can expect to be in the chair in about<br />
						<span className="time">30 minutes.</span>
					</p>

					{this.props.location.contactNumber && (
						<p>
							We'll text you 45 minutes before your cut. You should be here 20 minutes prior to your cut. This is not an
							appointment and we do not wait. If you are late you will need to re-sign in.
						</p>
					)}

					<Link to="/">
						<Button>Finish</Button>
					</Link>
				</Content>
			</Wrapper>
		)
	}
}

export default Finished
