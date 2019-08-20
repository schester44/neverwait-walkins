import React from 'react'
import { withRouter, Switch, Route } from 'react-router-dom'

import AuthenticatedRoutes from './components/AuthenticatedRoutes'
import GuestRoute from './components/GuestRoute'

import Auth from './views/AuthView'
import MultiResourceHomeView from './views/CheckInScreen'
import Form from './views/Form/RootContainer'
import Finished from './views/Form/FinishedView'

const RefreshBtn = () => {
		const [count, setCount] = React.useState(0)

		React.useEffect(() => {
			let timeout = window.setTimeout(() => {
				setCount(0)
			}, 2000)

			if (count === 3) {
				window.location.reload()
			}

			return () => window.clearTimeout(timeout)

		}, [count])

		return <div onClick={() => setCount(count => count + 1)} style={{ position: 'fixed', top: 0, right: 0, width: 100, height: 100 }}>
			
			</div>
	}


const App = () => {
	return (
		<>
			<RefreshBtn />
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
		</>
	)
}

export default withRouter(App)
