import React from 'react'
import { Switch, Route, useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { produce } from 'immer'
import startOfDay from 'date-fns/start_of_day'
import endOfDay from 'date-fns/end_of_day'

import Auth from './views/AuthView'
import CheckInScreen from './views/CheckInScreen'
import Form from './views/Form/RootContainer'
import Finished from './views/Form/FinishedView'
import RefreshBtn from './components/RefreshBtn'

import { locationDataQuery } from './graphql/queries'
import { isAuthenticated } from './graphql/utils'
import { appointmentsSubscription } from './graphql/subscriptions'

const isAuthed = isAuthenticated()

const App = () => {
	const [firstAvailableStack, setFirstAvailableStack] = React.useState([])

	const routeLocation = useLocation()

	const variables = {
		startTime: startOfDay(new Date()),
		endTime: endOfDay(new Date())
	}

	const { data, loading, subscribeToMore, refetch } = useQuery(locationDataQuery, {
		skip: !isAuthed,
		variables
	})

	React.useEffect(() => {
		// only refresh after 10 minutes when on the home screen.
		// this should help mitigate issues of incorrect barbers being shown, etc.
		if (routeLocation.pathname !== '/') return

		const refreshTimer = window.setInterval(() => refetch({ variables }), 1000 * 5)

		return () => {
			return window.clearInterval(refreshTimer)
		}
	}, [routeLocation, variables, refetch])

	const location = data ? data.location : {}

	React.useEffect(() => {
		if (!isAuthed || !location.id) return

		const unsubscribeFromSubscription = subscribeToMore({
			document: appointmentsSubscription,
			variables: {
				locationId: location.id
			},
			updateQuery: (previousQueryResult, { subscriptionData }) => {
				if (!subscriptionData.data.AppointmentsChange?.appointment) {
					return
				}

        const { appointment, employeeId, isNewRecord } = subscriptionData.data.AppointmentsChange

				const isDeleted = appointment.status === 'deleted'

				// No need to do anything since Apollo handles updates
				if (!isDeleted && !isNewRecord) {
					return previousQueryResult
				}

				return produce(previousQueryResult, draftState => {
					const indexOfEmployee = draftState.location.employees.findIndex(
						employee => Number(employee.id) === Number(employeeId)
					)

					if (indexOfEmployee === -1) return draftState

					const appointments = draftState.location.employees[indexOfEmployee].appointments

					if (isDeleted) {
						const indexOfDeletedAppointment = appointments.findIndex(
							appt => Number(appt.id) === Number(appointment.id)
						)

						appointments.splice(indexOfDeletedAppointment, 1)
					} else {
						appointments.push(appointment)
					}
				})
			}
		})

		return () => {
			unsubscribeFromSubscription()
		}
	}, [location.id, subscribeToMore])

	if (!isAuthed) return <Auth />

	if (loading) {
		return (
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				NEVERWAIT
			</div>
		)
	}

	// TODO: This could cause some issues
	if (!loading && !location.employees) {
		localStorage.removeItem('AuthToken')
		window.location.reload()
	}

	const employees = location.employees.filter(emp => emp.services.length > 0)

	return (
		<>
			<RefreshBtn />
			<Switch>
				<Route exact path="/">
					<CheckInScreen
						firstAvailableStack={firstAvailableStack}
						setFirstAvailableStack={setFirstAvailableStack}
						employees={employees}
						location={location}
					/>
				</Route>

				<Route path="/sign-in/:employeeId">
					<Form
						company={location.company}
						locationId={location.id}
						employees={location.employees}
					/>
				</Route>

				<Route path="/finished">
					<Finished location={location} />
				</Route>
			</Switch>
		</>
	)
}

export default App
