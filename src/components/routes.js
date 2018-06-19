import React from "react"
import { Route, Redirect } from "react-router-dom"
import { isAuthenticated } from "../graphql/utils"

export const AuthRoute = ({ component: Component, render, ...rest }) => (
	<Route
		{...rest}
		render={props =>
			isAuthenticated() ? render ? render(props) : <Component {...props} /> : <Redirect to={{ pathname: "/auth" }} />
		}
	/>
)

export const GuestRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={props => (!isAuthenticated() ? <Component {...props} /> : <Redirect to={{ pathname: "/" }} />)}
	/>
)
