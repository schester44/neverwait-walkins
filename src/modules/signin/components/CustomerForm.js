import React from "react"
import styled from "styled-components"

import Button from "../../../components/Button"
import Input from "../../../components/Input"

const Wrapper = styled("div")`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	flex: 1;
	height: 95%;
	padding-top: 50px;

	.buttons {
		width: 80%;
	}

	.form {
		width: 80%;
	}

	.form-input {
		width: 100%;
	}

	.back-btn {
		width: 100%;
		margin: 10px auto 50px auto;
		padding: 30px 10px;
		border: 0;
		border: 1px solid rgba(32, 32, 32, 0.2);
		border-radius: 50px;
		color: rgba(32, 32, 32, 0.2);
		font-size: 32px;
		outline: none;
		text-align: center;
	}
`

const SignInButton = styled("div")`
	position: relative;
	width: 100%;
	margin: 50px auto 15px auto;
	padding: 30px 10px;
	border: 0;
	background: rgba(247, 107, 97, 1);
	border-radius: 50px;
	color: white;
	font-size: 32px;
	outline: none;
	text-align: center;
	text-transform: uppercase;

	${props =>
		props.disabled &&
		`
		filter: blur(3px);
	`};
`

const CustomerForm = ({ onInputChange, fields, onSubmit, disabled, submitting, onBackBtnClick }) => {
	return (
		<Wrapper>
			<div className="form">
				<div className="form-input">
					<Input label="First Name" type="text" name="firstName" value={fields.firstName} onChange={onInputChange} />
				</div>

				<div className="form-input">
					<Input label="Last Name" type="text" name="lastName" value={fields.lastName} onChange={onInputChange} />
				</div>
			</div>

			<div className="buttons">
				<SignInButton
					disabled={disabled}
					submitting={submitting}
					onClick={e => {
						if (disabled || submitting) return
						onSubmit(e)
					}}
				>
					{submitting && <div className="loader" />}
					Sign In
				</SignInButton>
				<div className="back-btn" onClick={onBackBtnClick}>
					BACK
				</div>
			</div>
		</Wrapper>
	)
}

export default CustomerForm
