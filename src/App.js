import React, { Component } from "react"
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom"
import { hot } from "react-hot-loader"

import { Query } from "react-apollo"
import { isAuthenticated } from "./graphql/utils"
import { APPOINTMENTS_SUBSCRIPTION } from "./graphql/subscriptions"
import { LOCATION_QUERY } from "./graphql/queries"

import Auth from "./modules/auth/views/AuthView"
import MultiResourceHomeView from "./modules/home/views/MultiResource"
import Form from "./modules/signin/views/FormView"
import Finished from "./modules/signin/views/FinishedView"
import GuestRoute from "./components/GuestRoute"

const MainRoutes = ({ children }) => {
	const authed = isAuthenticated()

	if (!authed) {
		return <Redirect to={{ pathname: "/auth" }} />
	}

	// Get all the events for today
	const startTime = new Date()
	startTime.setHours(0, 0, 0, 0).toString()

	// TODO: There is a bug where an appointment can be booked at 11:50pm but it won't be returned since its end time will be 00:10
	const endTime = new Date()
	endTime.setHours(23, 59, 59, 0).toString()

	return (
		<Query query={LOCATION_QUERY} variables={{ startTime, endTime }}>
			{({ loading, data, subscribeToMore }) => {
				if (loading) return <div>LOADING SERVER DATA</div>

				// TODO: This may need work.
				if (!data.location) {
					localStorage.removeItem("AuthToken")
					return <Redirect to="/" />
				}

				console.log("RENDER")

				if (!this.unsub) {
					this.unsub = subscribeToMore({
						document: APPOINTMENTS_SUBSCRIPTION,
						variables: {
							locationId: data.location.id
						},
						updateQuery: (prev, { subscriptionData }) => {
							console.log("UPDATE QUERY")

							if (!subscriptionData.data || !subscriptionData.data.AppointmentsChange) return

							const appointment = subscriptionData.data.AppointmentsChange.appointment
							const employeeId = subscriptionData.data.AppointmentsChange.employeeId

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

							console.log(appointment)
							console.log(appointments)

							return {
								...prev,
								location: {
									...prev.location,
									employees: prev.location.employees.map(employee => {
										console.log(+employee.id === +employeeId ? "returning new appointments" : "old emp")
										return +employee.id === +employeeId
											? {
													...employee,
													appointments
											  }
											: employee
									})
								}
							}
						}
					})
				}

				return children({ location: data.location })
			}}
		</Query>
	)
}
class App extends Component {
	render() {
		return (
			<Router>
				<Switch>
					<GuestRoute path="/auth" component={Auth} />
					<MainRoutes>
						{({ location }) => {
							return (
								<React.Fragment>
									<Route
										exact
										path="/"
										render={props => {
											const employees = location.employees.filter(emp => emp.services.length > 0)

											console.log({ employees });
											return <MultiResourceHomeView employees={employees} location={location} />
										}}
									/>

									<Route
										path="/sign-in/:employeeId"
										render={props => {
											const employee = location.employees.find(emp => +emp.id === +props.match.params.employeeId)

											return (
												<Form
													locationId={location.id}
													employeeId={employee.id}
													services={employee.services}
													appointments={employee.appointments}
												/>
											)
										}}
									/>
									<Route path="/finished" component={Finished} />
								</React.Fragment>
							)
						}}
					</MainRoutes>
				</Switch>
			</Router>
		)
	}
}

export default hot(module)(App)
