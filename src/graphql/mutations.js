import gql from "graphql-tag"

export const CREATE_CUSTOMER = gql`
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

export const UPDATE_CUSTOMER = gql`
	mutation update($input: UpdateCustomerInput!) {
		UpdateCustomer(input: $input) {
			ok
			customer {
				id
				contactNumber
			}
			errors {
				message
			}
		}
	}
`

export const UPSERT_APPOINTMENT = gql`
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
