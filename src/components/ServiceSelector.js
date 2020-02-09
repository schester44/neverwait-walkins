import React from 'react'
import styled from 'styled-components'

import Service from './ServiceCard'

const Wrapper = styled('div')`
	display: flex;
	flex-wrap: wrap;
	flex: 1;
	max-height: 59vh;
	overflow: auto;
	-webkit-overflow-scrolling: touch;
	padding-bottom: 150px;
`

const ServiceSelector = ({
	selectedServices,
	services,
	onSelect,
	onIncreaseQuantity,
	onDecreaseQuantity,
	quantities
}) => {
	return (
		<Wrapper>
			{services.map(service => {
				const selected = selectedServices[service.id]

				return (
					<Service
						quantity={quantities[service.id]}
						key={`service-${service.id}`}
						onClick={() => onSelect(service)}
						onIncreaseQuantity={() => onIncreaseQuantity(service)}
						onDecreaseQuantity={() => onDecreaseQuantity(service)}
						service={service}
						selected={selected}
					/>
				)
			})}
		</Wrapper>
	)
}

const areEqual = (prev, next) => {
	return (
		prev.selectedServices === next.selectedServices &&
		prev.appointmentServices === next.appointmentServices &&
		prev.quantities === next.quantities
	)
}

export default React.memo(ServiceSelector, areEqual)
