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
	max-height: 100%;

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
		position: relative;

		img {
			max-width: 100%;
		}

		h1 {
			font-size: 80px;
			color: white;
		}

		p {
			font-size: 22px;
			position: absolute;
			text-align: center;
			bottom: 0;
			z-index: 5;
			text-shadow: 1px 2px 3px rgba(32, 32, 32, 1);
		}
	}

	.wait-time {
		text-align: center;
		flex: 1;
		margin-top: 100px;

		p {
			font-size: 3em;
			color: white;
		}

		h1 {
			font-size: 5em;
			font-weight: 700;
			text-transform: uppercase;
			line-height: 1.5;
		}
	}

	.signin-btn {
		margin-top: 50px;
		width: 100%;
		padding: 30px 10px;
		border: 0;
		background: rgba(97, 178, 249, 1);
		color: rgba(40, 64, 91, 1);
		border-radius: 5px;
		font-size: 32px;
	}
`


// TODO: Find the first N minute gap. thats when there is an opening available.
const generateWaitTime = memoize(appointments => {
	const now = new Date()

	return appointments.reduce((acc, appt) => {
		// filter out appointments that have ended
		if (isBefore(appt.endTime, now) || appt.status === "completed") {
			return acc
		}

		// appointment is in progress so don't add its entire duration, just calculate how much time is left
		if (isBefore(appt.startTime, now)) {
			return acc + differenceInMinutes(appt.endTime, now)
		}

		return acc + appt.duration
	}, 0)
})

const timeFragmentsFromMinutes = memoize(mins => {
	const hours = Math.floor(mins / 60)
	const minutes = Math.floor(60 * ((mins / 60) % 1))

	return { hours, minutes }
})

class Employee extends React.Component {
	state = {
		waitTime: 0
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		const waitTime = generateWaitTime(nextProps.employee.appointments)

		if (waitTime !== prevState.waitTime) {
			return { waitTime }
		}

		return null
	}

	componentDidMount() {
		this.timer = window.setInterval(() => {
			this.setState({
				waitTime: generateWaitTime(this.props.employee.appointments)
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
				{/* <div className="avatar" onClick={onClick}>
					<h1>{employee.firstName.charAt(0)}</h1>
					<p>
						{employee.firstName} Altobelli {employee.lastName}
					</p>
				</div> */}

				<div className="wait-time">
					<p>Estimated Wait Time</p>
					{this.state.waitTime < 5 ? (
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
