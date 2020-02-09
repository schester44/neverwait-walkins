import React from 'react'
import { render } from 'react-dom'
import { ApolloProvider } from '@apollo/client'
import { BrowserRouter as Router } from 'react-router-dom'
import Notifications from 'react-notify-toast'

import { client } from './apollo-client'

import App from './App'
import './index.css'

render(
	<ApolloProvider client={client}>
		<Router>
			<Notifications options={{ top: 20 }} />

			<App />
		</Router>
	</ApolloProvider>,
	document.getElementById('root')
)
