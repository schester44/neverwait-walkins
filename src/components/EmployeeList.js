import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import Employee from './Employee'
import FirstAvailableButton from './Employee/FirstAvailableButton'

import waitTimeInMinutes from './Employee/utils/waitTimeInMinutes'
import isWorking from './Employee/utils/isWorking'

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

const EmployeeList = ({ isFirstAvailableButtonEnabled, employees, firstAvailableStack, setFirstAvailableStack }) => {
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

	const firstAvailableBarberId = React.useMemo(() => {
		const barberIds = Object.keys(waitTimes)

		if (barberIds.length === 1 || !isFirstAvailableButtonEnabled) {
			return barberIds[0]
		}

		const indexInStackMap = barberIds.reduce((acc, id) => {
			const idx = firstAvailableStack.findIndex(i => i === id)
			acc[id] = idx === -1 ? 99 : idx

			return acc
		}, {})

		const weightedAndSortedIds = barberIds.sort(function(a, b) {
			var n = waitTimes[a] - waitTimes[b]

			if (n !== 0) return n

			return indexInStackMap[a] - indexInStackMap[b]
		})

		let nextBarberId = weightedAndSortedIds[0]

		// if the next barber was the last barber picked and the next barber available in the sorted IDs has the same wait time as the other barber then give the position to the second barber instead of the first since he's already in the line... this might need expanded to work with more than just the last 2.. also weightedAndSortedIds may already solve this issue.. but i'n ot sure.
		if (
			firstAvailableStack[0] === nextBarberId &&
			waitTimes[weightedAndSortedIds[0]] === waitTimes[weightedAndSortedIds[1]]
		) {
			nextBarberId = weightedAndSortedIds[1]
		}

		return nextBarberId
	}, [waitTimes, firstAvailableStack, isFirstAvailableButtonEnabled])

	const handleFirstAvailableClick = () => {
		history.push(`/sign-in/${firstAvailableBarberId}`)

		// chop off the 10th since we're adding 1 to the array. (limit stack size to 10)
		setFirstAvailableStack([firstAvailableBarberId, ...firstAvailableStack.slice(0, 9)])
	}

	const workingEmployees = employees.filter(employee => {
		return isWorking(employee, new Date()).working
	})

	return (
		<Wrapper>
			{workingEmployees.length > 1 && isFirstAvailableButtonEnabled && (
				<FirstAvailableButton
					employeeId={firstAvailableBarberId}
					waitTimes={waitTimes}
					onClick={handleFirstAvailableClick}
				/>
			)}

			{workingEmployees.map(employee => {
				return (
					<Employee
						waitTime={waitTimes[employee.id]}
						employee={employee}
						key={employee.id}
						onClick={() => {
							history.push(`/sign-in/${employee.id}`)
						}}
					/>
				)
			})}
		</Wrapper>
	)
}

export default EmployeeList
