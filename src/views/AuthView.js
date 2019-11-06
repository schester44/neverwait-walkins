import React, { useState } from 'react'
import styled from 'styled-components'
import { withApollo } from 'react-apollo'
import { authWithToken } from '../graphql/mutations'

import Input from '../components/Input'
import Button from '../components/Button'
import { AUTH_TOKEN_KEY } from '../constants'

const Wrapper = styled('div')`
	height: 100%;
	display: flex;
	margin: 0 auto;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 90%;

	.action {
		width: 100%;
		text-align: right;
		margin-top: 25px;
	}
`

const Errors = styled('div')`
	border-radius: 5px;
	background: rgba(255, 0, 0, 0.5);
	font-size: 32px;
	margin-bottom: 25px;
	border-radius: 5px;
	padding: 15px 25px;
	background: tomato;
`

const AuthView = ({ client }) => {
	console.log('[AuthView]')
	const [state, setState] = useState({
		isSubmiting: false,
		code: '',
		errors: []
	})

	const { code, isSubmiting, errors } = state

	const handleSubmit = async () => {
		setState(prevState => ({ ...prevState, isSubmiting: true }))

		try {
			const { data } = await client.mutate({
				mutation: authWithToken,
				variables: { key: code }
			})

			localStorage.setItem(AUTH_TOKEN_KEY, data.authWithToken.token)
			window.location.reload()
		} catch (error) {
			setState(prevState => ({ ...prevState, isSubmiting: false, errors: error.graphQLErrors || [] }))
		}
	}

	return (
		<Wrapper>
			{errors.length > 0 && (
				<Errors>
					{errors.map(({ message }, i) => {
						console.log(message)
						return <p key={i}>{message}</p>
					})}
				</Errors>
			)}

			<Input
				placeholder="Auth Code"
				type="text"
				name="code"
				autocapitalize="none"
				value={code}
				onChange={({ target: { value } }) => setState(prevState => ({ ...prevState, code: value }))}
			/>

			<div className="action">
				<Button
					onClick={handleSubmit}
					disabled={code.length === 0 || isSubmiting}
					style={{ padding: '20px 50px', fontSize: 32 }}
				>
					Authenticate
				</Button>
			</div>
		</Wrapper>
	)
}

export default withApollo(AuthView)
