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
	return (
		<Container>
			<div className="left">
				<div className="person">{employee.firstName}</div>

				<div className="wait-time">
					<h1>
						Next Available Time: <span className="highlight">{format(addMinutes(new Date(), waitTime), 'h:mma')}</span>
						<span style={{ fontSize: 14 }}>
							{' '}
							({time.hours > 0 && `${time.hours} ${time.hours === 1 ? 'hour' : 'hours'}`} {time.minutes}{' '}
							{time.minutes >= 1 && time.minutes === 1 ? 'min' : 'minutes'})
						</span>
					</h1>
				</div>
			</div>

			<div className="right">
				<button onClick={onClick}>SIGN IN</button>
			</div>
		</Container>
	)
}

export default Employee
