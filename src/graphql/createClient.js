import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'

import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { ApolloLink, split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'
import { AUTH_TOKEN_KEY } from '../constants'
import config from '../config'

const onErrorLink = onError(({ graphQLErrors, networkError, response }) => {
	if (networkError && networkError.result && networkError.result.errors) {
		networkError.result.errors.forEach(error => {
			console.log(error)
		})
	}

	if (graphQLErrors) {
		graphQLErrors.forEach(error => {

			// Only remove the token adn refresh the screen back to the auth screen if we're not already on the auth screen
			if (
				error.name === 'AuthenticationError' &&
				error.data.INVALID_SUBSCRIPTION &&
				window.location.pathname !== '/auth'
			) {
				localStorage.removeItem(AUTH_TOKEN_KEY)
				window.location.reload()
			}
		})
	}
})

const AuthLink = new ApolloLink((operation, forward) => {
	const token = localStorage.getItem(AUTH_TOKEN_KEY)

	if (token) {
		console.log('setting token context', token)
		operation.setContext({
			headers: {
				'x-access-token': token
			}
		})
	} else {
		console.log('(AuthLink): Token not available', token)
	}

	return forward(operation).map(response => {
		const context = operation.getContext()
		const {
			response: { headers }
		} = context

		if (headers) {
			const token = headers.get('x-access-token')

			if (token) {
				localStorage.setItem(AUTH_TOKEN_KEY, token)
				console.log('(AuthLink:middleware): TokenStored')
			} else {
				console.log('(AuthLink:middleware): TokenNotSent')
			}
		}

		return response
	})
})

export const wsLink = new WebSocketLink({
	uri: config.SUBSCRIPTION_URI,
	options: {
		reconnect: true,
		lazy: true,
		connectionParams: {
			token:
				console.log('subscription token:', localStorage.getItem(AUTH_TOKEN_KEY)) || localStorage.getItem(AUTH_TOKEN_KEY)
		}
	}
})

export const httpLink = ApolloLink.from([
	onErrorLink,
	AuthLink,
	new HttpLink({
		uri: config.API_URL
	})
])

const link = split(
	({ query }) => {
		const { kind, operation } = getMainDefinition(query)
		return kind === 'OperationDefinition' && operation === 'subscription'
	},
	wsLink,
	httpLink
)

const cache = new InMemoryCache()
const client = new ApolloClient({ link, cache })

export default client
