import React, { Component } from "react"
import { BrowserRouter as Router, Switch } from "react-router-dom"
import { GuestRoute, AuthRoute } from "./components/routes"
import { Query } from "react-apollo"

import Auth from "./modules/auth/views/AuthView"
import Home from "./modules/home/views/HomeView"
import Form from "./modules/signin/views/FormView"
import Finished from "./modules/signin/views/FinishedView"
import gql from "graphql-tag"

const LOCATION_QUERY = gql`
	{
		location {
			id
			name
			employees {
				id
				firstName
				appointments {
					startTime
				}
			}
		}
	}
`

const APPOINTMENT_CREATED_SUBSCRIPTION = gql`
	subscription appointmenCreated {
		appointmentCreated {
			employee {
				id
				firstName
				appointments {
					startTime
				}
			}
		}
	}
`

class App extends Component {
	componentWillUnmount() {
		if (this.unsubscribe) {
			this.unsubscribe()
		}
	}

	render() {
		return (
			<Query query={LOCATION_QUERY}>
				{({ loading, data, error, subscribeToMore }) => {
					if (loading) return <div>LOADING APP</div>

					if (!loading) {
						if (this.unsubscribe) {
							this.unsubscribe
						}

						this.unsubscribe = subscribeToMore({
							document: APPOINTMENT_CREATED_SUBSCRIPTION,
							updateQuery: (prev, { subscriptionData }) => {
								if (!subscriptionData || !subscriptionData.data) return prev

								return {
									...prev,
									location: {
										...prev.location,
										employees: prev.location.employees.map(
											employee =>
												employee.id === subscriptionData.data.appointmentCreated.employee.id
													? subscriptionData.data.appointmentCreated.employee
													: employee
										)
									}
								}
							}
						})
					}

					return (
						<Router>
							<Switch>
								<GuestRoute path="/auth" component={Auth} />
								<AuthRoute
									exact
									path="/"
									render={props => (
										<Home locationData={data.location} showWaitTimes={data.location.employees.length < 2} {...props} />
									)}
								/>
								<AuthRoute path="/sign-in" component={Form} />
								<AuthRoute path="/finished" component={Finished} />
							</Switch>
						</Router>
					)
				}}
			</Query>
		)
	}
}

export default App
