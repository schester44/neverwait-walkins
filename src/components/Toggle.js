import React from "react"
import styled from "styled-components"

const Wrapper = styled("div")`
    display: flex;
    align-items: center;

    .text {
        font-size: 22px;
        margin-left: 15px;
        opacity: 0.5;
    }


    label.checkbox {
        outline: none;
        user-select: none;
        display: inline-block;
        font-size: 14px;
        height: 100%;
        padding: 10px 0;

        > input {
            display: none;
        }

        i {
            background: rgba(255,255,255,0.5);
            border-radius: 40px;
            float: right;
            height: 42px;
            padding: 2px;
            position: relative;
            transition: .25s .09s;
            width: 84px;

            &.disabled {
                background: blue;
            }

            &::after {
                background: white;
                border-radius: 40px;
                content: ' ';
                display: block;
                height: 38px;
                left: 2px;
                position: absolute;
                top: 2px;
                transition: .25s;
                width: 40px;
            }
        }

        > input:checked + i {
            background: #29A72A;
        }

        > input:checked + i::after {
            transform: translateX(40px);
        }

        &:hover {
            color: white;
            cursor: pointer;
        }
    }
}
`

const Toggle = ({ textAlign, checked, text, onChange }) => {

    return (
		<Wrapper className="toggle">
			<div>
				<label className="checkbox">
					<input checked={checked} type="checkbox" onChange={onChange} />
					<i />
				</label>
			</div>
			<p className="text">{text}</p>
		</Wrapper>
	)
}

export default Toggle
