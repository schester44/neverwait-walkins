import React, { PureComponent } from "react"
import styled, { keyframes } from "styled-components"
import { compose } from "recompose"
import gql from "graphql-tag"
import { withApollo } from "react-apollo"

import format from "date-fns/format"
import distanceInWordsToNow from "date-fns/distance_in_words_to_now"

import Toggle from "../../../components/Toggle"
import AppHeader from "../../../components/AppHeader"
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
	width: 90vw;
	height: 63vh;
	display: flex;
	flex-direction: column;
	text-align: center;
	margin-top: 5vh;

	.phone-number {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 25px;

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

const PhoneInput = styled("div")`
	position: relative;
	width: 100%;
	opacity: 0;
	margin-top: 15px;
	animation: ${fadeIn} 0.5s ease forwards;
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

const CREATE_APPOINTMENT_MUTATION = gql`
	mutation CreateAppointment($input: AppointmentInput!) {
		createAppointment(input: $input) {
			ok
			appointment {
				id
				startTime
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
		this.setState({
			fields: {
				...this.state.fields,
				[name]: value
			}
		})
	}
	

	handleSubmit = async () => {
		this.setState({ isSubmitting: true })

		const checkInTime = format(new Date(), "YYYY-MM-DD HH:mm:ss")

		// TODO: Remove hard coded userID
		const variables = {
			input: { ...this.state.fields, checkInTime, userId: 1, locationId: this.props.locationId }
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
			const { appointment: { id, startTime } } = response.data.createAppointment
console.log(id);
			// TODO -- Take to next page Confirmation Page with details about when they should be in the chair. Ask them if they want to add a PIN to checkout faster, etc. need response.customer.id to update the customer.
			this.props.history.push({
				pathname: "/finished",
				contactNumber: this.state.fields.contactNumber,
				distance: distanceInWordsToNow(startTime)
			})
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
