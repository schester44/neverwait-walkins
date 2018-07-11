import React from "react"
import styled from "styled-components"
import { isBefore, differenceInMinutes } from "date-fns"
import memoize from "memoize-one"

const Wrapper = styled("div")`
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0px 20px;
	min-width: 50%;
	justify-content: center;
	max-height: 80%;

	.avatar {
		width: 150px;
		height: 150px;
		display: flex;
		justify-content: center;
		align-items: center;
		background: rgba(32, 32, 32, 0.2);
		border-radius: 3px;
		flex-direction: column;
		margin-bottom: 25px;

		h1 {
			font-size: 80px;
			color: white;
		}

		p {
			font-size: 22px;
		}
	}

	.wait-time {
		text-align: center;

		p {
			font-size: 14px;
			color: rgba(32, 32, 32, 0.5);
		}

		h1 {
			font-size: 32px;
			font-weight: 700;
			text-transform: uppercase;
		}
	}

	.signin-btn {
		margin-top: 50px;
		width: 100%;
		padding: 30px 10px;
		border: 0;
		background: rgba(247, 107, 97, 1);
		border-radius: 50px;
		color: white;
		font-size: 32px;
	}
`

const timeFragmentsFromMinutes = memoize(mins => {
	const hours = Math.floor(mins / 60)
	const minutes = Math.floor(60 * ((mins / 60) % 1))

	return { hours, minutes }
})

class Employee extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			waitTime: this.generateWaitTime(props.employee.appointments)
		}
	}

	generateWaitTime(appointments) {
		const now = new Date()

		return appointments.reduce((acc, appt) => {
			// filter out appointments that have ended
			if (isBefore(appt.endTime, now)) {
				return acc
			}

			// appointment is in progress so don't add its entire duration, just calculate how much time is left
			if (isBefore(appt.startTime, now)) {
				return acc + differenceInMinutes(appt.endTime, now)
			}

			return acc + appt.duration
		}, 0)
	}

	componentDidMount() {
		this.timer = window.setInterval(() => {
			console.log("UPDATING WAIT TIME")
			this.setState({
				waitTime: this.generateWaitTime(this.props.employee.appointments)
			})
		}, 60000)
	}

	componentWillUnmount() {
		if (this.timer) {
			window.clearInterval(this.timer)
		}
	}

	render() {
		const { employee, onClick } = this.props

		const time = timeFragmentsFromMinutes(this.state.waitTime)

		return (
			<Wrapper>
				<div className="avatar" onClick={onClick}>
					<h1>{employee.firstName.charAt(0)}</h1>
					<p>
						{employee.firstName} {employee.lastName}
					</p>
				</div>
				<div className="wait-time">
					<p>Estimate Wait Time</p>
					{this.state.waitTime < 10 ? (
						<h1>No Wait</h1>
					) : (
						<h1>{time.hours > 0 ? `${time.hours}hr ${time.minutes}mins` : `${time.minutes} mins`}</h1>
					)}
				</div>
				<button className="signin-btn" onClick={onClick}>
					SIGN IN
				</button>
			</Wrapper>
		)
	}
}

export default Employee
