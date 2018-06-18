import React from "react"
import { render } from "react-dom"
import { ApolloProvider } from "react-apollo"

import client from "./graphql/createClient"

import App from "./App"
import "./index.css"

render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
    , document.getElementById("root"))
