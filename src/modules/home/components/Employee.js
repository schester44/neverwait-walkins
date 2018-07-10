import React from "react"
import styled from "styled-components"
import { isAfter, isBefore, differenceInMinutes } from "date-fns"

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

const Employee = ({ employee, onClick }) => {
	const now = new Date()

	const waitTime = employee.appointments.reduce((acc, appt) => {
		// appointment has ended
		if (isBefore(appt.endTime, now)) {
			return acc
		}

		// appointment is in progress, get how much time is left
		if (isBefore(appt.startTime, now)) {
			return acc + differenceInMinutes(appt.endTime, now)
		}

		return acc + appt.duration
	}, 0)

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
				<h1>{waitTime} MINUTES</h1>
			</div>
			<button className="signin-btn" onClick={onClick}>
				SIGN IN
			</button>
		</Wrapper>
	)
}

export default Employee
