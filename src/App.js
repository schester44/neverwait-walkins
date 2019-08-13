import React from 'react'
import { withRouter, Switch, Route } from 'react-router-dom'

import AuthenticatedRoutes from './components/AuthenticatedRoutes'
import GuestRoute from './components/GuestRoute'

import Auth from './views/AuthView'
import MultiResourceHomeView from './views/CheckInScreen'
import Form from './views/Form/RootContainer'
import Finished from './views/Form/FinishedView'

const App = () => {
	console.log('[App]')

	return (
		<Switch>
			<GuestRoute path="/auth" component={Auth} />
			<AuthenticatedRoutes>
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
											blockedTimes={employee.blockedTimes}
											appointments={employee.appointments}
										/>
									)
								}}
							/>
							<Route path="/finished" locationId={location.id} component={Finished} />
						</React.Fragment>
					)
				}}
			</AuthenticatedRoutes>
		</Switch>
	)
}

export default withRouter(App)
