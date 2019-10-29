import React from 'react'
import { useHistory } from 'react-router-dom'
import Container from './Container'
import format from 'date-fns/format'
import addMinutes from 'date-fns/add_minutes'
import { FiClock } from 'react-icons/fi'

const FirstAvailableButton = ({ waitTimes, onClick }) => {
	const [nextAvailable, setNextAvailable] = React.useState(undefined)

	const time = {}
	const waitTime = {}
	const isWait = false

	React.useEffect(() => {

		console.log(waitTimes);
	}, [waitTimes])

	return (
		<Container onClick={onClick} firstAvailable>
			<div className="left">
				<div>
					<div className={`person ${isWait ? 'has-wait' : ''}`}>
						<div className="avatar">
							<FiClock color="rgba(144, 195, 85, 1.0)" />
						</div>

						<span>No Preference</span>
					</div>

					<div className="wait-time">
						<div className="wait-time--title">First Available Time</div>
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
				</div>
			</div>

			<div className="right">
				<button>CHOOSE</button>
			</div>
		</Container>
	)
}

export default FirstAvailableButton
