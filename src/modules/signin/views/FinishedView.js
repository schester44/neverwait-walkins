import React, { PureComponent } from "react"
import { Link, Redirect } from "react-router-dom"
import styled from "styled-components"
import { format, distanceInWords } from "date-fns"

const Wrapper = styled("div")`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
`

const Header = styled("div")`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;

	h1 {
		padding-top: 20px;
		font-family: marguerite;
		font-size: 62px;
	}
`

const Content = styled("div")`
	display: flex;
	flex-direction: column;

	width: 100%;
	height: 80vh;
	text-align: center;
	color: rgba(32, 32, 32, 1);
	margin-top: 3vh;

	.body {
		width: 100%;
		flex: 1;
	}

	h1 {
		margin-bottom: 25px;
		font-size: 28px;
	}

	p {
		opacity: 0.8;
		line-height: 1.5;
		font-size: 28px;
	}
`

const Button = styled("button")`
	position: relative;
	width: 80%;
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
`

class Finished extends PureComponent {
	componentDidMount() {
		this
		this.timeout = window.setTimeout(() => {
			this.props.history.push("/")
		}, 10000)
	}

	componentWillUnmount() {
		if (this.timeout) {
			window.clearTimeout(this.timeout)
		}
	}

	render() {
		const { appointment } = this.props.location

		if (!appointment) {
			return <Redirect to="/" />
		}

		return (
			<Wrapper>
				<Header>
					<h1>Lorenzo's</h1>
				</Header>

				<Content>
					<div className="body">
						<h1>
							You have checked in with {appointment.employee.firstName} for a {appointment.services[0].name}.
						</h1>

						<p>You can expect to be in the chair around: {format(appointment.startTime, "h:mma")}.</p>
						<p>Current wait is about {` ${distanceInWords(new Date(), appointment.startTime)}`}.</p>
					</div>

					<Link to="/">
						<Button>Finish</Button>
					</Link>
				</Content>
			</Wrapper>
		)
	}
}

export default Finished
