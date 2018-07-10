import React, { Component } from "react"
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom"
import GuestRoute from "./components/GuestRoute"

import Auth from "./modules/auth/views/AuthView"
import SingleResourceHomeView from "./modules/home/views/SingleResource"
import MultiResourceHomeView from "./modules/home/views/MultiResource"

import Form from "./modules/signin/views/FormView"
import Finished from "./modules/signin/views/FinishedView"
import gql from "graphql-tag"

import { Query } from "react-apollo"
import { isAuthenticated } from "./graphql/utils"

export const LOCATION_QUERY = gql`
	query LocationQuery($startTime: String!, $endTime: String!) {
		location {
			id
			name
			employees(input: { where: { bookingEnabled: true } }) {
				id
				firstName
				services {
					id
					name
					price
					duration
				}
				appointments(input: { where: { startTime: { gte: $startTime }, endTime: { lte: $endTime } } }) {
					id
					duration
					startTime
					endTime
				}
			}
		}
	}
`

const MainRoutes = ({ children }) => {
	const authed = isAuthenticated()

	if (!authed) {
		return <Redirect to={{ pathname: "/auth" }} />
	}

	console.log("MAIN ROUTES RENDER")
	const startTime = new Date()
	startTime.setHours(0, 0, 0, 0).toString()
	const endTime = new Date()
	endTime.setHours(23, 59, 59, 0).toString()

	return (
		<Query query={LOCATION_QUERY} variables={{ startTime, endTime }}>
			{({ loading, data }) => {
				if (loading) return <div>LOADING</div>

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

export default App
