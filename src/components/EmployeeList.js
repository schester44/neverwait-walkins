import React from "react"
import styled from "styled-components"
import { withRouter } from "react-router-dom"
import Employee from "./Employee/WaitTime"

const Wrapper = styled("div")`
	padding: 20px 20px 40px 20px;
	height: 100%;
	margin-top: 50px;
`

const EmployeeList = ({ employees, history }) => {
	return (
		<Wrapper>
			{employees.map(employee => (
				<Employee
					employee={employee}
					key={employee.id}
					onClick={() => {
						history.push(`/sign-in/${employee.id}`)
					}}
				/>
			))}
		</Wrapper>
	)
}

export default withRouter(EmployeeList)
