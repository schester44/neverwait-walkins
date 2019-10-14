import React, { useState, useEffect } from 'react'
import Container from './Container'

import waitTimeInMinutes from './utils/waitTimeInMinutes'
import timeFragments from './utils/timeFragments'
import addMinutes from 'date-fns/add_minutes'
import format from 'date-fns/format'

const Employee = ({ employee, onClick }) => {
	const [waitTime, setWaitTime] = useState(waitTimeInMinutes(employee.appointments, employee.blockedTimes))

	useEffect(() => {
		const timer = window.setInterval(() => {
			setWaitTime(waitTimeInMinutes(employee.appointments, employee.blockedTimes))
		}, 60000)

		return () => {
			window.clearInterval(timer)
		}
	}, [employee.appointments, employee.blockedTimes])

	useEffect(() => {
		const newWaitTime = waitTimeInMinutes(employee.appointments, employee.blockedTimes)

		if (waitTime !== newWaitTime) {
			setWaitTime(newWaitTime)
		}
	}, [employee.appointments, waitTime, employee.blockedTimes])

	const time = timeFragments(waitTime)
	const isWait = time.hours > 0 || time.minutes > 0

	return (
		<Container onClick={onClick}>
			<div className="left">
				<div>
					<div className={`person ${isWait ? 'has-wait' : ''}`}>
						<div className="avatar">{employee.firstName.charAt(0)}</div>

						<span>{employee.firstName}</span>
					</div>

					{isWait && (
						<div className="wait-time">
							<div className="wait-time--title">Next Available Time</div>
							<h1 className="wait-time--highlight">
								{format(addMinutes(new Date(), waitTime), 'h:mma')}

								{(time.hours > 0 || time.minutes > 0) && (
									<span style={{ fontSize: 20, color: '#fff', opacity: 0.3, marginLeft: 8 }}>
										(
										{time.hours > 0 && (
											<span>
												{time.hours} {time.hours === 1 ? 'hour' : 'hours'}
											</span>
										)}
										{time.minutes > 0 && (
											<span>
												{time.hours > 0 && ' '}
												{time.minutes} {time.minutes === 1 ? 'min' : 'minutes'}
											</span>
										)}
										)
									</span>
								)}
							</h1>
						</div>
					)}

					{!isWait && (
						<div className="wait-time">
							<h1 className="wait-time--highlight">Available Now</h1>
						</div>
					)}
				</div>
			</div>

			<div className="right">
				<button>SIGN IN</button>
			</div>
		</Container>
	)
}

export default Employee
