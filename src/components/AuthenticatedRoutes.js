import React from "react"
import { Redirect } from "react-router-dom"
import { Query } from "react-apollo"

import { appointmentsSubscription, blockedTimesSubscription } from "../graphql/subscriptions"
import { LOCATION_QUERY } from "../graphql/queries"
import { isAuthenticated } from "../graphql/utils"

import LoadingScreen from "./LoadingScreen"
import { startOfDay, endOfDay } from "date-fns"

class AuthenticatedRoutes extends React.Component {
	onAppointmentUpdate = (prev, { subscriptionData }) => {
		if (!subscriptionData.data || !subscriptionData.data.AppointmentsChange) return

		const { appointment, employeeId } = subscriptionData.data.AppointmentsChange

		const employee = prev.location.employees.find(emp => +emp.id === +employeeId)

		if (!employee) {
			console.log(`[ERROR]: No employee with that ID ${employeeId}`)
			return false
		}

		const appointmentsById = employee.appointments.reduce((acc, curr) => {
			acc[curr.id] = curr
			return acc
		}, {})

		const appointments = appointmentsById[appointment.id]
			? employee.appointments.map(app => (+app.id === +appointment.id ? appointment : app))
			: [...employee.appointments, appointment]

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

		subscribeToMore({
			document: blockedTimesSubscription,
			variables: { locationId },
			updateQuery: this.onBlockedTimeUpdate
		})
	}

	onBlockedTimeUpdate = (prev, { subscriptionData }) => {
		if (!subscriptionData.data || !subscriptionData.data.BlockedTimeChange) return

		const { blockedTime, deleted, employeeId } = subscriptionData.data.BlockedTimeChange

		const employee = prev.location.employees.find(emp => +emp.id === +employeeId)

		if (!employee) {
			console.log(`[ERROR]: No employee with that ID ${employeeId}`)
			return false
		}

		const timedById = employee.blockedTimes.reduce((acc, curr) => {
			acc[curr.id] = curr
			return acc
		}, {})

		const blockedTimes = deleted
			? //delete
			  employee.blockedTimes.filter(({ id }) => +id !== +blockedTime.id)
			: timedById[blockedTime.id]
			? // update
			  employee.blockedTimes.map(time => (+time.id === +blockedTime.id ? blockedTime : time))
			: // insert
			  [...employee.blockedTimes, blockedTime]

		return {
			...prev,
			location: {
				...prev.location,
				employees: prev.location.employees.map(employee =>
					+employee.id === +employeeId
						? {
								...employee,
								blockedTimes
						  }
						: employee
				)
			}
		}
	}

	render() {
		if (!isAuthenticated()) {
			return <Redirect to={{ pathname: "/auth" }} />
		}

		return (
			<Query query={LOCATION_QUERY} variables={{ startTime: startOfDay(new Date()), endTime: endOfDay(new Date()) }}>
				{({ loading, data, subscribeToMore }) => {
					if (loading) return <LoadingScreen />

					// TODO: This may need work
					if (!(data || {}).location) {
						localStorage.removeItem("AuthToken")
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
