import React, { PureComponent } from "react"
import styled from "styled-components"
import gql from "graphql-tag"
import { withApollo } from "react-apollo"

import AppHeader from "../../../components/AppHeader"
import Input from "../../../components/Input"
import Button from "../../../components/Button"

const Wrapper = styled("div")`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
`

const Contents = styled("div")`
	height: 70vh;
	width: 70vw;
	display: flex;
	flex-direction: column;
	justify-content: center;

	.action {
		width: 100%;
		text-align: right;
		margin-top: 25px;
	}
`

const Errors = styled("div")`
	border-radius: 5px;
	background: rgba(255, 0, 0, 0.5);
	font-size: 32px;
	margin-bottom: 25px;
	border-radius: 5px;
	padding: 15px 25px;
`

const AUTH_WITH_TOKEN_MUTATION = gql`
	mutation AuthWithToken($key: String!) {
		AuthWithToken(key: $key) {
			ok
			token
			errors {
				message
			}
		}
	}
`

class AuthView extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			isHelpVisible: false,
			isSubmiting: false,
			code: "",
			errors: []
		}
	}

	toggleHelpScreen = () => this.setState({ isHelpVisible: !this.state.isHelpVisible })

	handleCodeInput = ({ target: { value: code } }) => {
		this.setState({ code })
	}

	handleSubmit = async () => {
		this.setState({ isSubmiting: true })

		const response = await this.props.client
			.mutate({
				mutation: AUTH_WITH_TOKEN_MUTATION,
				variables: { key: this.state.code }
			})
			.catch(error => {
				console.log(error)
			})

		this.setState({
			isSubmiting: false
		})

		if (response.data.AuthWithToken.errors && response.data.AuthWithToken.errors.length > 0) {
			return this.setState({ errors: response.data.AuthWithToken.errors })
		}

		localStorage.setItem("AuthToken", response.data.AuthWithToken.token)
		this.props.history.push('/')
	}

	render() {
		return (
			<Wrapper>
				<AppHeader />
				<Contents>
					{this.state.errors.length > 0 && (
						<Errors>{this.state.errors.map(({ message }, i) => <p key={i}>{message}</p>)}</Errors>
					)}

					<Input label="Auth Code" value={this.state.code} onChange={this.handleCodeInput} />
					<div className="action">
						<Button
							onClick={this.handleSubmit}
							disabled={this.state.code.length === 0 || this.state.isSubmiting}
							style={{ padding: "20px 50px", fontSize: 32 }}
						>
							Authenticate
						</Button>
					</div>
				</Contents>
			</Wrapper>
		)
	}
}

export default withApollo(AuthView)
