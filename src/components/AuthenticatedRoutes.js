import React from 'react'
import { Redirect } from 'react-router-dom'
import { Query } from 'react-apollo'

import { appointmentsSubscription } from '../graphql/subscriptions'
import { LOCATION_QUERY } from '../graphql/queries'
import { isAuthenticated } from '../graphql/utils'

import LoadingScreen from './LoadingScreen'
import { startOfDay, endOfDay } from 'date-fns'

class AuthenticatedRoutes extends React.Component {
	onAppointmentUpdate = (prev, { subscriptionData }) => {
		if (!subscriptionData.data || !subscriptionData.data.AppointmentsChange) return

		const { appointment, employeeId, isNewRecord, deleted } = subscriptionData.data.AppointmentsChange

		const employee = prev.location.employees.find(emp => Number(emp.id) === Number(employeeId))
		const isDeleted = deleted || appointment.deleted

		if (!employee) {
			console.log(`[ERROR]: No employee with that ID ${employeeId}`)
			return prev
		}

		// No need to do anything since Apollo handles updates... rite?
		if (!isDeleted && !isNewRecord) {
			return prev
		}

		const appointments = isDeleted
			? employee.appointments.filter(appt => Number(appt.id) !== Number(appointment.id))
			: employee.appointments.concat([appointment])

		return {
			...prev,
			location: {
				...prev.location,
				employees: prev.location.employees.map(employee =>
					+employee.id === +employeeId
						? {
								...employee,
								appointments
						  }
						: employee
				)
			}
		}
	}

	subscribe = (locationId, subscribeToMore) => {
		this.unsub = subscribeToMore({
			document: appointmentsSubscription,
			variables: { locationId },
			updateQuery: this.onAppointmentUpdate
		})
	}

	render() {
		if (!isAuthenticated()) {
			return <Redirect to={{ pathname: '/auth' }} />
		}

		return (
			<Query query={LOCATION_QUERY} variables={{ startTime: startOfDay(new Date()), endTime: endOfDay(new Date()) }}>
				{({ loading, data, subscribeToMore }) => {
					if (loading) return <LoadingScreen />

					// TODO: This may need work
					if (!(data || {}).location) {
						localStorage.removeItem('AuthToken')
						return <Redirect to="/" />
					}

					if (!this.unsub) {
						this.subscribe(data.location.id, subscribeToMore)
					}

					return this.props.children({ location: data.location })
				}}
			</Query>
		)
	}
}

export default AuthenticatedRoutes
