import React from "react"
import styled from "styled-components"

const Wrapper = styled("div")`
	width: 100%;
	text-align: left;
	margin-bottom: 50px;
	position: relative;

	label {
		position: absolute;
		transform: translate(20px, 57px);
		text-transform: uppercase;
		color: rgba(250, 250, 250, 0.4);
		font-size: 32px;
		font-weight: 300;
		transition: all 0.5s ease;
	}

	.input-wrapper {
		width: 100%;
		padding-top: 25px;
	}

	input {
		font-size: 32px;
		border: 0;
		margin-top: 10px;
		background: rgba(109, 109, 122, 1);
		border: 0;
		border-bottom: 2px solid rgba(32, 32, 32, 0.4);
		border-radius: 5px;
		width: 100%;
		outline: none;
		padding: 20px;
		font-weight: 400;
		outline: none;
		color: rgba(250, 250, 250, 0.8);
		pointer-events: none;
	}

	${props =>
		props.focused &&
		`
        input {
            transition: all .5s ease;
            border-bottom: 2px solid rgba(32,32,32,0.8);
        }

        label {
			transform: translate(0px, 0px);
            font-size: 22px;
		    font-weight: 300;
        }
    `};
`

class Input extends React.Component {
	state = { focused: false }
	ref = null

	setRef = el => {
		this.ref = el
	}

	render() {
		return (
			<Wrapper
				focused={this.props.value.length > 0 || this.state.focused}
                onClick={() => {
                    
                    if (this.ref) {
                        this.ref.focus()
                    }

					this.setState({ focused: true })
				}}
			>
				{this.props.label && <label>{this.props.label}</label>}
				<div className="input-wrapper">
					<input
						{...this.props}
						autoComplete="off"
						ref={this.setRef}
						onBlur={() => {
							if (this.props.value.length === 0) {
								this.setState({ focused: false })
							}
						}}
					/>
				</div>
			</Wrapper>
		)
	}
}

export default Input
