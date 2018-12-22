import gql from "graphql-tag"

export const authWithToken = gql`
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
