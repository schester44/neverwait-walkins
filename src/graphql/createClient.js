import { ApolloClient } from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
import { onError } from "apollo-link-error"

import { HttpLink } from "apollo-link-http"
import { WebSocketLink } from "apollo-link-ws"
import { ApolloLink, split } from "apollo-link"
import { getMainDefinition } from "apollo-utilities"

const onErrorLink = onError(({ graphQLErrors, networkError }) => {
	console.log({ graphQLErrors, networkError })
})

const AuthLink = new ApolloLink((operation, forward) => {
	const token = localStorage.getItem("AuthToken")

	if (token) {
		operation.setContext({
			headers: {
				"x-token": token
			}
		})
	}

	return forward(operation).map(response => {
		const context = operation.getContext()
		const {
			response: { headers }
		} = context

		if (headers) {
			const token = headers.get("x-token")

			if (token) {
				localStorage.setItem("AuthToken", token)
			}
		}

		return response
	})
})

const wsLink = new WebSocketLink({
	uri: `ws://localhost:3443/subscriptions`,
	options: {
		reconnect: true,
		connectionParams: {
			token: localStorage.getItem("AuthToken"),
		},
	}
})

const httpLink = ApolloLink.from([
	onErrorLink,
	AuthLink,
	new HttpLink({
		uri: "http://localhost:3443/api"
	})
])
	

const link = split(
	({ query }) => {
		const { kind, operation } = getMainDefinition(query)
		return kind === "OperationDefinition" && operation === "subscription"
	},
	wsLink,
	httpLink
)

const cache = new InMemoryCache()

const client = new ApolloClient({ link, cache })

export default client
