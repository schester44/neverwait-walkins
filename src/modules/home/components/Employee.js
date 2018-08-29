import React from "react"
import styled from "styled-components"
import { isBefore, differenceInMinutes, subMinutes, addMinutes } from "date-fns"
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
			font-size: 7em;
			font-weight: 700;
			line-height: 1.5;

			.small {
				font-size: 0.5em;
				opacity: 0.8;
			}
		}
	}

	.signin-btn {
		margin-top: 50px;
		width: 100%;
		padding: 30px 10px;
		border: 0;
		background: rgba(244, 37, 49, 1);
		color: white;
		border-radius: 5px;
		font-size: 32px;
	}
`

const waitTimeInMinutes = appointments => {
	const now = new Date()

	// sort by startTime so appointments are in the order of which they occur
	const sortedAppointments = [...appointments]
		.filter(({ status }) => status !== "completed" && status !== "deleted")

		.sort((a, b) => new Date(a.startTime) - new Date(b.startTime))

	// Last appointment is used to generate the current wait time. If the appointment is in the past then it shouldn't be considered as the lastAppointment since we don't want to create appointments in the past and we can just use the current time instead.
	const lastAppt = sortedAppointments.find((appointment, index) => {
		const next = sortedAppointments[index + 1]

		// if the appointment's end time is before now, AKA it has already ended then don't consider it the last appointment.
		if (isBefore(appointment.endTime, subMinutes(now, 2))) {
			return false
		}

		// either theres only one appointment, or this is the last appointment in the list
		if (!next && isBefore(now, appointment.endTime)) {
			// Add twenty minutes to the current time. Are we still before the appointment? Then lets return false since its obviously not an accurate wait time.-
			if (isBefore(addMinutes(now, 20), appointment.startTime)) {
				return false
			}

			return true
		}

		// We're adding 15 + 2 minutes to each appointments endTime. if the new endTime is before the next appointments start time then we can assume there is a gap of at least N + 2 minutes. We should insert the appointment since theres room for the appointment.
		if (next && isBefore(addMinutes(appointment.endTime, 15 + 2), next.startTime)) {
			return true
		}

		return false
	})

	console.log(lastAppt)

	if (!lastAppt) return 0
	return differenceInMinutes(lastAppt.endTime, now)
}

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
		const waitTime = waitTimeInMinutes(nextProps.employee.appointments)

		if (waitTime !== prevState.waitTime) {
			return { waitTime }
		}

		return null
	}

	componentDidMount() {
		this.timer = window.setInterval(() => {
			this.setState({
				waitTime: waitTimeInMinutes(this.props.employee.appointments)
			})
		}, 60000)
	}

	componentWillUnmount() {
		if (this.timer) {
			window.clearInterval(this.timer)
		}
	}

	render() {
		const { onClick } = this.props

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
						<h1>
							{time.hours > 0 ? (
								<span>
									{time.hours}
									<span className="small">hr</span> {time.minutes}
									<span className="small">min</span>
								</span>
							) : (
								<span>
									{time.minutes} <span className="small">m</span>
								</span>
							)}
						</h1>
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
