import React from "react"
import styled from "styled-components"

const Wrapper = styled("div")`
	width: 100%;
	text-align: left;
	margin-bottom: 50px;
	position: relative;

	label {
		position: absolute;
		top: 57px;
		left: 10px;
		text-transform: uppercase;
		color: rgba(32, 32, 32, 0.4);
		font-size: 32px;
		font-weight: 300;
        transition: all .5s ease;
	}

	.input-wrapper {
		width: 100%;
		padding-top: 25px;
	}

	input {
		font-size: 32px;
		border: 0;
		margin-top: 10px;
		background: white;
        border: 0;
        border-bottom: 2px solid rgba(32,32,32,0.4);
        width: 100%;
        outline: none;
		padding: 20px;
		font-weight: 400;
		outline: none;
		color: rgba(32, 32, 32, 0.8);
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
            top: 20px;
            left: 0;
            color: rgba(32,32,32,0.8);
            font-size: 22px;
		    font-weight: 700;
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
