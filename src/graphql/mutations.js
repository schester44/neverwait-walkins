import { gql } from '@apollo/client'

export const authWithToken = gql`
	mutation authWithToken($key: String!) {
		authWithToken(key: $key)
	}
`

export const findOrCreateCustomerMutation = gql`
	mutation findOrCreateCustomer($input: CreateCustomerInput!) {
		findOrCreateCustomer(input: $input) {
			id
			firstName
			lastName
		}
	}
`

export const createWalkinAppointmentMutation = gql`
	mutation createAppointment($input: CreateWalkinAppointmentInput!) {
		createWalkinAppointment(input: $input) {
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
	}
`
