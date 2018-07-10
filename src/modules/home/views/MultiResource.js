import React, { PureComponent } from "react"
import styled from "styled-components"

import EmployeeList from "../components/EmployeeList"

const Wrapper = styled("div")`
	display: flex;
	flex-direction: column;
	height: 100%;

	.header {
		padding: 40px 0 0 0;
		text-align: center;
		font-family: marguerite;

		h1 {
			font-size: 42px;
		}
	}
`

class MultiResource extends PureComponent {
	render() {
		return (
			<Wrapper>
				<div className="header">
					<h1>Lorenzo's</h1>
				</div>

				<EmployeeList employees={this.props.employees} />
			</Wrapper>
		)
	}
}

export default MultiResource
