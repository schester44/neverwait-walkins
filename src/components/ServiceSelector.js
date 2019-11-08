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

const ServiceSelector = ({ selectedServices, services, onSelect }) => {
	return (
		<Wrapper>
			{services.map(service => {
				const selected = selectedServices.includes(service.id)

				return (
					<Service
						key={`service-${service.id}`}
						onClick={() => onSelect(service)}
						service={service}
						selected={selected}
					/>
				)
			})}
		</Wrapper>
	)
}

const areEqual = (prevProps, nextProps) => prevProps.selectedServices.length === nextProps.selectedServices.length

export default React.memo(ServiceSelector, areEqual)
