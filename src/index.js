import React from "react"
import { render } from "react-dom"
import { ApolloProvider } from "react-apollo"
import { BrowserRouter as Router } from "react-router-dom"
import client from "./graphql/createClient"

import App from "./App"
import "./index.css"

render(
	<ApolloProvider client={client}>
		<Router>
			<App />
		</Router>
	</ApolloProvider>,
	document.getElementById("root")
)
