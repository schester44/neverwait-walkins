import React, { useState, useEffect } from "react"
import Container from "./Container"

import waitTimeInMinutes from "./utils/waitTimeInMinutes"
import timeFragmentsFromMinutes from "./utils/timeFragments"

const Employee = ({ employee, onClick }) => {
	const [waitTime, setWaitTime] = useState(waitTimeInMinutes(employee.appointments, employee.blockedTimes))

	useEffect(() => {
		const timer = window.setInterval(() => {
			setWaitTime(waitTimeInMinutes(employee.appointments, employee.blockedTimes))
		}, 60000)

		return () => {
			window.clearInterval(timer)
		}
	}, [])

	useEffect(
		() => {
			const newWaitTime = waitTimeInMinutes(employee.appointments, employee.blockedTimes)

			if (waitTime !== newWaitTime) {
				setWaitTime(newWaitTime)
			}
		},
		[employee.appointments, employee.blockedTimes]
	)

	const time = timeFragmentsFromMinutes(waitTime)

	return (
		<Container>
			<div className="person">{employee.firstName}</div>

			<div className="right">
				<div className="wait-time">
					{waitTime >= 5 && <p>Est. Wait Time</p>}
					{waitTime < 5 ? (
						<h1>No Wait</h1>
					) : (
						<h1>
							{time.hours > 0 ? (
								<span>
									{time.hours}
									<span className="small"> hr{time.hours > 1 && "s"}</span> {time.minutes}
									<span className="small"> minutes</span>
								</span>
							) : (
								<span>
									{time.minutes} <span className="small">minutes</span>
								</span>
							)}
						</h1>
					)}
				</div>
				<button onClick={onClick}>SIGN IN</button>
			</div>
		</Container>
	)
}

export default Employee
