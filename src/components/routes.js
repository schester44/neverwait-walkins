import React from "react"
import { Route, Redirect } from "react-router-dom"
import isAuthenticated from "../graphql/authenticated"

export const AuthRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={props => (isAuthenticated() ? <Component {...props} /> : <Redirect to={{ pathname: "/auth" }} />)}
	/>
)

export const GuestRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={props => (!isAuthenticated() ? <Component {...props} /> : <Redirect to={{ pathname: "/" }} />)}
	/>
)
