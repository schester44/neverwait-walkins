import React, { Component } from "react"
import { BrowserRouter as Router, Switch } from "react-router-dom"

import { GuestRoute, AuthRoute } from "./components/routes"

import Auth from "./modules/auth/views/AuthView"
import Home from "./modules/home/views/HomeView"
import Form from "./modules/signin/views/FormView"
import Finished from "./modules/signin/views/FinishedView"

import { Subscription } from "react-apollo"
import gql from "graphql-tag"

// TODO --- How to have multiple subscriptions? Do I need one for all CRUD operations?
// Need to update Wait Time & Appointment list.

const BOOKING_SUBSCRIPTION = gql`
	subscription onAppointmentCreate {
		appointmentCreated {
			waitTime
		}
	}
`

class App extends Component {
	render() {
		return (
			<Subscription subscription={BOOKING_SUBSCRIPTION}>
				{({ loading, data, error }) => {
					if (loading) {
						return <div />
					}

					return (
						<Router>
							<Switch>
								<GuestRoute path="/auth" component={Auth} />
								<AuthRoute exact path="/" component={Home} />
								<AuthRoute path="/sign-in" component={Form} />
								<AuthRoute path="/finished" component={Finished} />
							</Switch>
						</Router>
					)
				}}
			</Subscription>
		)
	}
}

export default App
