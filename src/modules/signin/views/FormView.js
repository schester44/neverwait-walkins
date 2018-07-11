import React, { PureComponent } from "react"
import styled from "styled-components"
import { withRouter } from "react-router-dom"

import { compose } from "recompose"
import gql from "graphql-tag"
import { withApollo } from "react-apollo"

import format from "date-fns/format"
import distanceInWordsToNow from "date-fns/distance_in_words_to_now"

import { addMinutes, isAfter } from "date-fns"

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

const CREATE_CUSTOMER = gql`
	mutation createCustomer($input: CreateCustomerInput!) {
		CreateCustomer(input: $input) {
			ok
			customer {
				id
				firstName
				lastName
			}
		}
	}
`

const UPSERT_APPOINTMENT = gql`
	mutation upsert($input: AppointmentInput!) {
		upsertAppointment(input: $input) {
			ok
			appointment {
				id
				startTime
				endTime
				duration
				services {
					name
				}
				employee {
					firstName
					lastName
				}
				customer {
					id
					firstName
					lastName
				}
			}
			errors {
				message
			}
		}
	}
`
class Form extends PureComponent {
	constructor(props) {
		super(props)

		const now = new Date()
		const lastAppt = props.appointments[props.appointments.length - 1]
		const checkInTime = format(now, DB_DATE_STRING)
		const startTime = lastAppt && isAfter(lastAppt.endTime, now) ? lastAppt.endTime : checkInTime

		this.state = {
			page: 1,
			selectedService: undefined,
			isSubmitting: false,
			appointment: {
				userId: props.employeeId,
				locationId: props.locationId,
				startTime,
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

			const {
				data: { upsertAppointment }
			} = await this.props.client.mutate({
				mutation: UPSERT_APPOINTMENT,
				variables: {
					input: {
						...this.state.appointment,
						endTime: format(addMinutes(this.state.appointment.startTime, duration), DB_DATE_STRING),
						customerId
					}
				}
			})

			if (!upsertAppointment.ok) {
				throw new Error("Failed to create the appointment. Please see the receptionist.")
			}

			this.props.client.resetStore()

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
		return (
			<Wrapper>
				<Header>
					<h1>Lorenzo's</h1>
				</Header>

				<Content>
					{this.state.page === 1 ? (
						<ServiceSelector
							services={this.props.services}
							disabled={this.state.appointment.services.length === 0}
							selectedService={this.state.selectedService}
							onSelect={this.handleServiceSelection}
							onBackBtnClick={this.decrementPage}
							onNextBtnClick={this.incrementPage}
						/>
					) : (
						<CustomerForm
							submitting={this.state.isSubmitting}
							disabled={this.state.customer.firstName.length === 0}
							fields={this.state.customer}
							onSubmit={this.handleSubmit}
							onBackBtnClick={this.decrementPage}
							onInputChange={this.handleInputChange}
						/>
					)}
				</Content>
			</Wrapper>
		)
	}
}

export default compose(
	withRouter,
	withApollo
)(Form)
