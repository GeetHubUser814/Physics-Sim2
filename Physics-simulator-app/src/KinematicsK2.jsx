import React from 'react';
import Mather from './Mather';

export const Icon = ({size = 24, ...props}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path d="M 3 3 L 3 21 L 22 21 M 3 15 L 18 5" stroke="black" strokeWidth="0.1" />
        <path d="M 3 15 L 18 15 M 18 5 L 18 21" stroke="black" strokeWidth="0.1" strokeDasharray="0.7"/>
        <foreignObject x="0" y="7" width="24" height="24" fontSize="2">
            <div>
                <Mather math="t"/>
            </div>
        </foreignObject>
        <foreignObject x="-4" y="-3" width="24" height="24" fontSize="2">
            <div style={{ position: 'absolute', top: 0, left: 5 }}>
                <Mather math="v"/>
            </div>
        </foreignObject>
    </svg>
)