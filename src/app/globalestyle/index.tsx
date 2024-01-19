import React, { ReactElement } from 'react';
import './globlestyle.scss';
import styled, { css } from 'styled-components';
import { fontDatas } from 'src/dataText/dataHomeForm';

interface children {
    children: ReactElement;
}
const FontTexts = styled.div`
    width: 100%;
    ${fontDatas.map((f) => {
        if (f.type.length > 1) {
            return f.type.map(
                (t) => css`
                    @font-face {
                        font-family: ${f.name + ' ' + t.name};
                        src: url(${t.url}) format('truetype');
                        font-weight: 400;
                    }
                `,
            );
        } else {
            return css`
                @font-face {
                    font-family: ${f.name + ' ' + f.type[0].name};
                    src: url(${f.url}) format('truetype');
                    font-weight: 400;
                }
            `;
        }
    })}
`;
const Globalestyle: React.FC<children> = ({ children }) => {
    return <FontTexts>{children}</FontTexts>;
};

export default Globalestyle;
