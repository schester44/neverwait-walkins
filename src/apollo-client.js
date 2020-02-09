import { ApolloClient, HttpLink } from '@apollo/client'
import { onError } from 'apollo-link-error'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { WebSocketLink } from 'apollo-link-ws'
import { ApolloLink, split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'
import config from './config'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { notify } from 'react-notify-toast'

const onErrorLink = onError(({ graphQLErrors, networkError }) => {
	if (networkError && networkError.result && networkError.result.errors) {
		networkError.result.errors.forEach(console.log)
	}

	if (graphQLErrors) {
		graphQLErrors.forEach(error => {
			notify.show(error.message, 'error', 7000)
			// Only remove the token adn refresh the screen back to the auth screen if we're not already on the auth screen
			if (error.name === 'AuthenticationError' || error.data?.INVALID_SUBSCRIPTION) {
				localStorage.removeItem('nw-walkin-sess')

				if (window.location.pathname !== '/auth') {
					window.location.href = '/auth'
				}
			}
		})
	}
})

const subClient = new SubscriptionClient(config.SUBSCRIPTION_URI, {
	credentials: 'include',
	reconnect: true,
	lazy: true
})

export const wsLink = new WebSocketLink(subClient)

subClient.on('connected', () => console.log('socket connected'))
subClient.on('disconnected', () => console.log('socket disconnected'))
subClient.on('reconnecting', () => console.log('socket reconnecting'))
subClient.on('reconnected', () => console.log('socket reconnected'))

export const httpLink = ApolloLink.from([
	onErrorLink,
	new HttpLink({
		credentials: 'include',
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

export const client = new ApolloClient({ link, cache })
