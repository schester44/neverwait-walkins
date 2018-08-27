import React, { PureComponent } from "react"
import styled from "styled-components"

import { format, subMinutes } from "date-fns"
import Input from "../../../components/Input"

import { UPDATE_CUSTOMER, UPSERT_APPOINTMENT } from "../../../graphql/mutations"
import { withApollo } from "react-apollo"

const Wrapper = styled("div")`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
`

const Header = styled("div")`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;

	h1 {
		padding-top: 20px;
		font-family: marguerite;
		font-size: 62px;
	}
`

const Content = styled("div")`
	display: flex;
	flex-direction: column;

	padding: 0 20px;

	width: 100%;
	height: 80vh;
	text-align: center;
	color: white;
	margin-top: 3vh;

	.body {
		width: 100%;
		flex: 1;
	}

	.estimated-time {
		margin-bottom: 50px;
		color: white;

		span {
			color: red;
		}
	}

	h1 {
		margin-bottom: 50px;
		font-size: 3em;
	}

	p {
		opacity: 0.8;
		line-height: 1.5;
		font-size: 2em;
	}
`

const Button = styled("button")`
	width: 100%;
	padding: 30px 10px;
	margin: 50px auto 15px auto;
	border: 0;
	background: rgba(244, 37, 49, 1);
	color: white;
	border-radius: 5px;
	font-size: 32px;
	text-align: center;
	border: 2px solid transparent;
`

const PhoneNumber = styled("div")`
	margin: 0 auto;
	width: 70%;
	p {
		font-weight: 100 !important;
		opacity: 1;
		margin: 0 !important;
		line-height: 1;
		font-size: 20px;
	}

	.input-wrapper {
		padding-top: 0;
	}
`

const vowels = {
	a: true,
	e: true,
	i: true,
	o: true,
	u: true
}

class Finished extends PureComponent {
	state = { number: "", error: undefined }

	componentDidMount() {
		this.setTimer()
	}

	setTimer() {
		if (this.timeout) {
			window.clearTimeout(this.timeout)
		}

		this.timeout = window.setTimeout(() => {
			this.props.history.push("/")
		}, 30000)
	}

	componentWillUnmount() {
		if (this.timeout) {
			window.clearTimeout(this.timeout)
		}
	}

	handleInput = ({ target: { value } }) => {
		this.setState({ number: value })
		this.setTimer()
	}

	handleFinish = async () => {
		// if (this.state.number.length === 0) {
		return this.props.history.push("/")
		// }

		// try {
		// 	const { customer } = await this.props.client.mutate({
		// 		mutation: UPDATE_CUSTOMER,
		// 		variables: {
		// 			input: {
		// 				id: this.props.location.customerId,
		// 				contactNumber: this.state.number,
		// 				appointmentNotifications: "sms"
		// 			}
		// 		}
		// 	})
		// 	/* TODO: Serverless request
		// 		* customer.firstName,
		// 		appointment.employee.firstName
		// 		appointment.startTime
		// 	*/
		// } catch (e) {}

		// TODO: Update Appointment & enable notification
	}

	render() {
		const { appointment, customerId } = this.props.location

		// const appointment = {
		// 	services: [{ name: "DEVELOPMENT" }],
		// 	startTime: new Date(),
		// 	employee: {
		// 		firstName: "Testing"
		// 	}
		// }

		return (
			<Wrapper>
				<Header>
					<h1>Lorenzo's</h1>
				</Header>

				<Content>
					<div className="body">
						<p style={{ marginBottom: 50 }}>
							You have created
							{vowels[appointment.services[0].name.charAt(0).toLowerCase()] ? " an " : " a "}
							{appointment.services[0].name} appointment with {appointment.employee.firstName}.
						</p>

						<h1 className="estimated-time">
							Your estimated appointment time is <span>{format(appointment.startTime, "h:mma")}</span>.
						</h1>

						<p>
							Feel free to leave the shop and come back within 20 minutes of your scheduled appointment time (
							{format(subMinutes(appointment.startTime, 20), "h:mma")}
							), just leave a $10 deposit at the front desk.
						</p>

						<p style={{ fontSize: 20, color: "white", marginTop: 20 }}>
							If you DO NOT come back on time or if you DO NOT call in advance to cancel your appointment you WILL NOT
							get your deposit back.
						</p>
					</div>

					{/* <PhoneNumber>
						<p>Add your phone number to be notified when you're next.</p>
						<Input
							name="Phone Number"
							value={this.state.number}
							onChange={this.handleInput}
							placeholder="Phone Number"
						/>
					</PhoneNumber> */}

					<Button onClick={this.handleFinish}>Finish</Button>
				</Content>
			</Wrapper>
		)
	}
}

export default withApollo(Finished)
