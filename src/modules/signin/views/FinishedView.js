import React, { PureComponent } from "react"
import { Link, Redirect } from "react-router-dom"
import styled from "styled-components"
import { format } from "date-fns"

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
	color: white;
	margin-top: 3vh;

	.body {
		width: 100%;
		flex: 1;
	}

	h1 {
		margin-bottom: 50px;
		font-size: 3em;
	}

	p {
		opacity: 0.8;
		line-height: 1.5;
		font-size: 2em;
	}
`

const Button = styled("button")`
	width: 80%;
	padding: 30px 10px;
	margin: 50px auto 15px auto;
	border: 0;
	background: rgba(244, 37, 49, 1);
	color: white;
	border-radius: 5px;
	font-size: 32px;
	text-align: center;
	border: 2px solid transparent;
`

const vowels = {
	a: true,
	e: true,
	i: true,
	o: true,
	u: true
}

class Finished extends PureComponent {
	componentDidMount() {
		this
		this.timeout = window.setTimeout(() => {
			this.props.history.push("/")
		}, 20000)
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
							You have created
							{vowels[appointment.services[0].name.charAt(0).toLowerCase()] ? " an " : " a "}
							{appointment.services[0].name} appointment with {appointment.employee.firstName}.
						</h1>

						<p style={{ marginBottom: 50, color: "white" }}>
							You can expect to be in the chair around: {format(appointment.startTime, "h:mma")}.
						</p>

						{/*  -- this isn't completely accurate and displays a longer wait time then it should. TODO: Find more accurate distanceInWords function
						
						<p style={{ marginBottom: 50 }}>
							Current wait is {` ${distanceInWords(new Date(), appointment.startTime)}`}.
						</p> */}

						<p>
							Feel free to leave the shop and come back within 20 minutes of your scheduled appointment time, just leave
							a $10 refundable deposit at the front desk.
						</p>
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
