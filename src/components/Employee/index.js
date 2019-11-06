import React from 'react'
import Container from './Container'

import timeFragments from './utils/timeFragments'
import addMinutes from 'date-fns/add_minutes'
import format from 'date-fns/format'

const Employee = ({ waitTime, employee, onClick }) => {
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
