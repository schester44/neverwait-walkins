import React, { Component } from "react"
import { BrowserRouter as Router, Switch } from "react-router-dom"
import isAuthenticated from "./graphql/authenticated"
import { GuestRoute, AuthRoute } from "./components/routes"

import Auth from "./modules/auth/views/AuthView"
import Home from "./modules/home/views/HomeView"
import Form from "./modules/signin/views/FormView"
import Finished from "./modules/signin/views/FinishedView"

import { Query } from "react-apollo"
import gql from "graphql-tag"

const APPOINTMENTS_QUERY = gql`
	query appointments($locationId: Int!) {
		appointments(locationId: $locationId) {
			id
			startTime
			customer {
				firstName
			}
			employee {
				firstName
			}
		}
	}
`

const Loading = () => <div style={{ width: "100%", fontSize: 100, height: "100%", background: "red" }}>LOADING</div>

class App extends Component {
	state = {
		locationId: null
	}

	componentDidMount() {}

	render() {
		const { locationId } = this.state

		return (
			<Query query={APPOINTMENTS_QUERY} variables={{ locationId }}>
				{({ loading, data, error }) => {
					if (loading) return <Loading />

					return (
						<Router>
							<Switch>
								<GuestRoute path="/auth" component={Auth} />
								<AuthRoute exact path="/" component={Home} />
								<AuthRoute path="/sign-in" render={props => <Form {...props} locationId={locationId} />} />
								<AuthRoute path="/finished" render={props => <Finished {...props} locationId={locationId} />} />
							</Switch>
						</Router>
					)
				}}
			</Query>
		)
	}
}

export default App
