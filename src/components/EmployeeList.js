import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import Employee from './Employee/WaitTime'
import FirstAvailableButton from './Employee/FirstAvailableButton'

import waitTimeInMinutes from './Employee/utils/waitTimeInMinutes'

const Wrapper = styled('div')`
	padding: 20px 20px 40px 20px;
	height: 100%;
	margin-top: 50px;
`

const mapWaitTimes = employees => {
	return employees.reduce((acc, employee) => {
		acc[employee.id] = waitTimeInMinutes(employee.appointments, employee.blockedTimes)
		return acc
	}, {})
}

const EmployeeList = ({ employees, onFirstAvailableClick }) => {
	const history = useHistory()

	const [waitTimes, setWaitTimes] = React.useState(mapWaitTimes(employees))

	React.useEffect(() => {
		const timer = window.setInterval(() => {
			setWaitTimes(mapWaitTimes(employees))
		}, 60000)

		setWaitTimes(mapWaitTimes(employees))

		return () => {
			window.clearInterval(timer)
		}
	}, [employees])

	return (
		<Wrapper>
			<FirstAvailableButton
				waitTimes={waitTimes}
				onClick={() => {
					onFirstAvailableClick(waitTimes)
				}}
			/>

			{employees.map(employee => (
				<Employee
					waitTime={waitTimes[employee.id]}
					employee={employee}
					key={employee.id}
					onClick={() => {
						history.push(`/sign-in/${employee.id}`)
					}}
				/>
			))}
		</Wrapper>
	)
}

export default EmployeeList
