import { gql } from '@apollo/client'

export const locationDataQuery = gql`
	query LocationQuery($startTime: DateTime!, $endTime: DateTime!) {
		location {
			company {
				name
			}
			id
			name
			settings {
				walkins {
					isFirstAvailableButtonEnabled
				}
			}

			employees(input: { where: { bookingEnabled: true } }) {
				id
				firstName

				schedule_ranges(input: { where: { start_date: $startTime, end_date: $endTime } }) {
					start_date
					end_date
					day_of_week
					schedule_shifts {
						start_time
						end_time
						acceptingWalkins
					}
				}

				services {
					id
					name
					sources(input: { where: { type: default } }) {
						price
						duration
					}
				}
				appointments(
					input: {
						where: {
							status: { eq: confirmed }
							startTime: { gte: $startTime }
							endTime: { lte: $endTime }
						}
					}
				) {
					id
					status
					duration
					startTime
					endTime
				}
			}
		}
	}
`

export const searchCustomers = gql`
	query searchCustomers($input: CustomerSearchInput!) {
		searchCustomers(input: $input) {
			id
			firstName
			lastName
			appointments {
				past {
					id
					services {
						id
					}
				}
			}
		}
	}
`
