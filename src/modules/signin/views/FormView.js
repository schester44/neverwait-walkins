import React, { PureComponent } from "react"
import styled from "styled-components"
import { compose } from "recompose"
import { withRouter } from "react-router-dom"
import { withApollo } from "react-apollo"

import format from "date-fns/format"
import addMinutes from "date-fns/add_minutes"
import isAfter from "date-fns/is_after"

import { CREATE_CUSTOMER, UPSERT_APPOINTMENT } from "../../../graphql/mutations"

import { DB_DATE_STRING } from "../../../constants"
import ServiceSelector from "../components/ServiceSelector"
import CustomerForm from "../components/CustomerForm"

const Wrapper = styled("div")`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
`

const Content = styled("div")`
	width: 100%;
	flex: 1;
	display: flex;
	flex-direction: column;
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

const SecondaryButton = styled("div")`
	width: 80%;
	padding: 30px 10px;
	margin: 50px auto 15px auto;
	border: 0;
	background: transparent;
	color: rgba(97, 178, 249, 1);
	border-radius: 5px;
	font-size: 32px;
	text-align: center;
	border: 2px solid transparent;
`

const PrimaryButton = styled("div")`
	width: 80%;
	padding: 30px 10px;
	margin: 50px auto 15px auto;
	border: 0;
	background: rgba(97, 178, 249, 1);
	color: rgba(40, 64, 91, 1);
	border-radius: 5px;
	font-size: 32px;
	text-align: center;
	border: 2px solid transparent;
	box-shadow: 0px 2px 10px rgba(32, 32, 32, 0.5);

	${props =>
		props.disabled &&
		`
		background: transparent;
		border: 2px solid #ccc;
		color: #ccc;
	`};
`

class Form extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			page: 1,
			selectedService: undefined,
			isSubmitting: false,
			appointment: {
				userId: props.employeeId,
				locationId: props.locationId,
				services: []
			},
			customer: {
				firstName: "",
				lastName: ""
			}
		}

		this.allServices = props.services.reduce((acc, service) => {
			acc[service.id] = service
			return acc
		}, {})
	}

	handleSubmit = async () => {
		this.setState({ isSubmitting: true })

		const duration = this.state.appointment.services.reduce((acc, id) => {
			return acc + this.allServices[id].duration
		}, 0)

		try {
			const {
				data: { CreateCustomer }
			} = await this.props.client.mutate({
				mutation: CREATE_CUSTOMER,
				variables: {
					input: this.state.customer
				}
			})

			if (!CreateCustomer.ok) {
				throw new Error("Failed to create the customer account. Please see the receptionist.")
			}

			const customerId = CreateCustomer.customer.id

			const lastAppt = this.props.appointments[this.props.appointments.length - 1]
			const now = new Date()
			const checkInTime = format(now, DB_DATE_STRING)

			// If the appointment hasn't been completed or if its end time is after right now then it can be considered to still be in progress. If its still in progress than set the start time of this appointment to the endTime of the last appointment else set it to right now
			const startTime =
				lastAppt && (lastAppt.status !== "completed" || isAfter(lastAppt.endTime, now))
					? addMinutes(lastAppt.endTime, 2)
					: checkInTime

			const {
				data: { upsertAppointment }
			} = await this.props.client.mutate({
				mutation: UPSERT_APPOINTMENT,
				variables: {
					input: {
						...this.state.appointment,
						startTime,
						endTime: format(addMinutes(startTime, duration), DB_DATE_STRING),
						customerId
					}
				}
			})

			if (!upsertAppointment.ok) {
				throw new Error("Failed to create the appointment. Please see the receptionist.")
			}

			this.props.history.push({
				pathname: "/finished",
				appointment: upsertAppointment.appointment
			})
		} catch (error) {
			console.log("error", error)
			this.setState({ isSubmitting: false })
		}
	}

	handleInputChange = ({ target: { name, value } }) => {
		this.setState({
			customer: {
				...this.state.customer,
				[name]: value
			}
		})
	}

	handleServiceSelection = service => {
		this.setState({
			selectedService: service.id,
			appointment: {
				...this.state.appointment,
				services: [service.id]
			}
		})
	}

	incrementPage = () => {
		this.setState({ page: this.state.page + 1 })
	}

	decrementPage = () => {
		if (this.state.page === 1) {
			return this.props.history.push("/")
		}

		this.setState({ page: this.state.page - 1 })
	}

	render() {
		const buttonDisabled =
			this.state.page === 1 ? this.state.customer.firstName.length === 0 : this.state.appointment.services.length === 0

		return (
			<Wrapper>
				<Header>
					<h1>Lorenzo's</h1>
				</Header>

				<Content>
					{this.state.page === 1 ? (
						<CustomerForm fields={this.state.customer} onInputChange={this.handleInputChange} />
					) : (
						<ServiceSelector
							services={this.props.services}
							selectedService={this.state.selectedService}
							onSelect={this.handleServiceSelection}
						/>
					)}

					<div className="buttons">
						{!buttonDisabled && (
							<PrimaryButton
								submitting={this.state.isSubmitting}
								onClick={e => {
									if (this.state.isSubmitting) return

									if (this.state.page === 1) {
										this.incrementPage()
									} else {
										this.handleSubmit()
									}
								}}
							>
								{this.state.isSubmitting && <div className="loader" />}
								{this.state.page === 1 ? "NEXT" : "CHECK IN"}
							</PrimaryButton>
						)}
						<SecondaryButton onClick={this.decrementPage}>BACK</SecondaryButton>
					</div>
				</Content>
			</Wrapper>
		)
	}
}

export default compose(
	withRouter,
	withApollo
)(Form)
