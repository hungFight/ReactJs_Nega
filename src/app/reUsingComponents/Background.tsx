import React, { useState } from 'react';
import { BanI, ColorsI } from '~/assets/Icons/Icons';
import { DivFlexPosition } from './styleComponents/styleComponents';
import { Div } from './styleComponents/styleDefault';
const colors = [
    { id: 0, color: 'transparent', icon: <BanI /> },
    { id: 1, color: '#1b1919' },
    { id: 2, color: '#fcfcfc' },
    { id: 3, color: 'antiquewhite' },
    { id: 4, color: 'coral' },
    { id: 5, color: '#e37bb5' },
    { id: 6, color: '#7185e1' },
    { id: 7, color: '#71cbe1' },
];
const Background: React.FC<{ bg: string; setBg?: React.Dispatch<React.SetStateAction<string>>; rootCss?: string }> = ({ bg, setBg, rootCss }) => {
    const [showColors, setShowColors] = useState(false);

    return (
        <DivFlexPosition
            width="auto"
            css={`
                top: 15px;
                right: 12.5px;
                font-size: 30px;
                flex-direction: column;
                z-index: 1;
                ${rootCss}
            `}
        >
            <Div display="block" css="position: relative;">
                <Div
                    css={`
                        position: absolute;
                        top: -5px;
                        right: -2px;
                        padding: 2px;
                        background-color: ${bg || '#4e4e4e'};
                        border-radius: 50%;
                        color: ${bg === '#fcfcfc' ? '#1e1e1e' : '#ffffff'};
                        z-index: 1;
                        cursor: var(--pointer);
                    `}
                    onClick={() => setShowColors(!showColors)}
                >
                    <ColorsI />
                </Div>
                {colors.map((cl, index) => (
                    <Div
                        key={cl.id}
                        css={`
                            width: 27px;
                            height: 27px;
                            border-radius: 5px;
                            transition: all 0.5s linear;
                            position: absolute;
                            top: ${(index + 1) * 30}px;
                            right: 2px;
                            cursor: var(--pointer);
                            background-color: ${cl.color};
                            ${index === 0 ? 'color: white;' : ''}
                            ${!showColors && 'top: 0px; background-color: #00000000; color:#00000000; '}
                        `}
                        onClick={() => {
                            if (setBg) setBg(cl.color);
                        }}
                    >
                        {cl?.icon}
                    </Div>
                ))}
            </Div>
        </DivFlexPosition>
    );
};

export default Background;
