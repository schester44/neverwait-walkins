import React, { PureComponent } from "react"
import styled, { keyframes } from "styled-components"
import { compose } from "recompose"
import Toggle from "../../../components/Toggle"
import AppHeader from "../../../components/AppHeader"

import { withApollo } from "react-apollo"

import gql from "graphql-tag"

import Input from "../../../components/Input"
import Button from "../../../components/Button"

const fadeIn = keyframes`
	from {
		opacity: 0;
		top: -15px;
	}

	to {
		opacity: 1;
		top: 0;
	}
`

const Wrapper = styled("div")`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
`

const Content = styled("div")`
	width: 80vw;
	height: 80vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	text-align: center;
	margin-top: 10vh;

	.phone-number {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 25px;

		.form-input {
			width: 100%;
			margin-top: 25px;
		}

		.instructions {
			margin-top: 10px;
			opacity: 0.2;
		}
	}

	.form-input-row {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}
`

const styles = {
	inputWrapper: {
		width: "45%"
	},
	phoneNumberWrapper: {
		flex: 1
	},
	button: { marginTop: "5vh", marginBottom: "15vh" }
}


const PhoneInput = styled("div")`
	position: relative;
	width: 100%;
	opacity: 0;
	animation: ${fadeIn} 0.5s ease forwards;
`

const CREATE_APPOINTMENT_MUTATION = gql`
	mutation CreateAppointment($input: AppointmentInput!) {
		createAppointment(input: $input) {
			ok
			appointment {
				id
			}
			customer {
				totalBookings
			}
			customerCreated
			errors {
				message
			}
		}
	}
`

class Form extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			isSubmitting: false,
			isReceivingText: false,
			fields: {
				firstName: "",
				lastName: "",
				contactNumber: null,
				pin: null
			}
		}
	}

	handleTextToggle = ({ target: { checked } }) => {
		this.setState({ isReceivingText: checked })
	}

	handleInputChange = ({ target: { name, value } }) => {
		console.log(name, value)
		this.setState({
			fields: {
				...this.state.fields,
				[name]: value
			}
		})
	}

	handleSubmit = async () => {
		this.setState({ isSubmitting: true })

		const startTime = Math.round(+new Date() / 1000)

		const variables = {
			input: { ...this.state.fields, startTime, checkInTime: startTime, userId: 1, locationId: this.props.locationId }
		}

		const response = await this.props.client
			.mutate({
				mutation: CREATE_APPOINTMENT_MUTATION,
				variables
			})
			.catch(error => {
				console.log(error)
			})

		this.setState({ isSubmitting: false })

		if (response.data.createAppointment.ok) {
			// TODO -- Take to next page Confirmation Page with details about when they should be in the chair. Ask them if they want to add a PIN to checkout faster, etc. need response.customer.id to update the customer.
			this.props.history.push("/finished")
		}
	}


	render() {
		return (
			<Wrapper>
				<AppHeader />
				<Content>
					<div className="form-input-row">
						<div style={styles.inputWrapper}>
							<Input label="First Name" type="text" name="firstName" onChange={this.handleInputChange} />
						</div>

						<div style={styles.inputWrapper}>
							<Input label="Last Name" type="text" name="lastName" onChange={this.handleInputChange} />
						</div>
					</div>

					<div className="phone-number" style={styles.phoneNumberWrapper}>
						<div className="toggle-prompt">
							<Toggle textAlign="right" onChange={this.handleTextToggle} text="Receive a text when its your turn?" />
						</div>

						{this.state.isReceivingText && (
							<PhoneInput>
								<Input label="Phone Number" type="tel" name="contactNumber" onChange={this.handleInputChange} />
								<p className="instructions">You will receive a text 30 minutes before your appointment.</p>
							</PhoneInput>
						)}
					</div>

					<Button
						style={styles.button}
						disabled={this.state.isSubmitting || this.state.fields.firstName.length === 0}
						onClick={this.handleSubmit}
					>
						Sign In
					</Button>
				</Content>
			</Wrapper>
		)
	}
}

export default compose(withApollo)(Form)
