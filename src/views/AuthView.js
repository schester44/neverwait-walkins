import React from 'react'
import styled from 'styled-components'
import { useMutation } from '@apollo/client'

import { authWithToken } from '../graphql/mutations'

import Input from '../components/Input'
import Button from '../components/Button'
import { AUTH_TOKEN_KEY } from '../constants'

const Wrapper = styled('div')`
	height: 60vh;
	display: flex;
	margin: 0 auto;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	width: 90%;

	.header {
		font-family: Domus, sans-serif;
		font-size: 44px;
		padding-top: 80px;
		display: flex;
		align-items: center;

		h1 {
			font-size: 1em;
		}

		img {
			max-width: 60px;
			margin-right: 16px;
		}
	}

	.form {
		width: 100%;
	}

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

const AuthView = () => {
	const [auth, { loading }] = useMutation(authWithToken)

	const [state, setState] = React.useState({
		code: '',
		errors: []
	})

	const { code, errors } = state

	const handleSubmit = async () => {
		try {
			const { data } = await auth({
				variables: { key: code }
			})

			localStorage.setItem(AUTH_TOKEN_KEY, data.authWithToken.token)
			window.location.reload()
		} catch (error) {
			setState(prevState => ({ ...prevState, errors: error.graphQLErrors || [] }))
		}
	}

	return (
		<Wrapper>
			<div className="header">
				<img src="images/logo.png" />
				<h1>NEVERWAIT</h1>
			</div>

			<div className="form">
				{errors.length > 0 && (
					<Errors>
						{errors.map(({ message }, i) => (
							<p key={i}>{message}</p>
						))}
					</Errors>
				)}

				<Input
					placeholder="Auth Code"
					type="text"
					name="code"
					autoCapitalize="none"
					value={code}
					onChange={({ target: { value } }) =>
						setState(prevState => ({ ...prevState, code: value }))
					}
				/>

				<div className="action">
					<Button
						onClick={handleSubmit}
						disabled={code.length === 0 || loading}
						style={{ padding: '20px 50px', fontSize: 32 }}
					>
						Authenticate
					</Button>
				</div>
			</div>
		</Wrapper>
	)
}

export default AuthView
