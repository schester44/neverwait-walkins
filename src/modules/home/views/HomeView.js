import React, { PureComponent } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import distanceInWords from "date-fns/distance_in_words"

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
		width: 90vw;
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
	margin-bottom: 15vh;

	font-size: 42px;
	padding: 50px 0;
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

class HomeView extends PureComponent {
	state = {
		startTime: 0
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		// Don't set the waitTime state if theres more than 1 employee.
		if (nextProps.locationData.employees.length > 1) return null

		const appointments = nextProps.locationData.employees[0].appointments
		const appointment = appointments[appointments.length - 1]

		const startTime = appointment ? appointment.startTime : new Date()

		// TODO: take in consideration the duration of the lastAppointment.
		// current waitTime is always off between 15-25 minutes due to not including the duration.

		return {
			startTime,
			waitTime: distanceInWords(new Date(), startTime)
		}
	}

	componentDidMount() {
		this.timer = window.setInterval(() => {
			this.setState({ waitTime: distanceInWords(new Date(), this.state.startTime) })
		}, 60 * 1000)
	}

	componentWillUnmount() {
		window.clearInterval(this.timer)
	}

	render() {
		const { showWaitTimes, location } = this.props
		return (
			<Wrapper>
				<div className="inner">
					<h1>Lorenzo's</h1>

					<StyledLink to="/sign-in">
						<Button>Sign In Here</Button>
					</StyledLink>

					{showWaitTimes && (
						<h4>
							Estimated Wait Time:<br />
							{this.state.waitTime}
						</h4>
					)}
				</div>
			</Wrapper>
		)
	}
}

export default HomeView
