import { ApolloClient } from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
import { onError } from "apollo-link-error"

import { HttpLink } from "apollo-link-http"
import { ApolloLink } from "apollo-link"

const onErrorLink = onError(({ graphQLErrors, networkError }) => {
    console.log({ graphQLErrors, networkError });
})

const AuthLink = new ApolloLink((operation, forward) => {
	operation.setContext({
		headers: {
			'x-token': localStorage.getItem("AuthToken")
		}
	})

	return forward(operation).map((response) => {
		const context = operation.getContext()
		const { response: { headers } } = context

		if (headers) {
			const token = headers.get('x-token')

			if (token) {
				localStorage.setItem('AuthToken', token)
			}
		}

		return response
	})
})

const link = ApolloLink.from([
	onErrorLink,
	AuthLink,
	new HttpLink({
		uri: "http://localhost:3333/api"
	})
])

const cache = new InMemoryCache()

const client = new ApolloClient({ link, cache })

export default client
