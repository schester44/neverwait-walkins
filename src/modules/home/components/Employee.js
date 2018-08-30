import React from "react"
import styled from "styled-components"
import { isBefore, differenceInMinutes, subMinutes, addMinutes, isAfter } from "date-fns"
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
	let index = undefined
	const now = new Date()

	const sortedAppointments = [...appointments]
		.filter(({ status, endTime }) => status !== "completed" && status !== "deleted" && isAfter(endTime, now))
		.sort((a, b) => new Date(a.startTime) - new Date(b.startTime))


	for (let i = 0; i < sortedAppointments.length; i++) {
		const current = sortedAppointments[i]

		// if the first event is more than 20 minutes away then break because theres room for an appointment.
		if (i === 0 && isBefore(addMinutes(now, 20), current.startTime)) {
			break
		}

		const difference = differenceInMinutes(
			current.startTime,
			sortedAppointments[i - 1] ? sortedAppointments[i - 1].endTime : now
		)

		// if the difference between the current appointment is more than 20 minutes from the last appointment, then set the last appointment as the last appointment. else set the current appointment as the last appointment.
		if (difference > 20) {
			index = i - 1
			break
		} else {
			index = i
		}
	}

	if (!isNaN(index)) {
		return differenceInMinutes(sortedAppointments[index].endTime, now)
	}

	return 0
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
