import React, { ReactElement } from 'react';
import './globlestyle.scss';
import styled, { css } from 'styled-components';
import { fontDatas } from 'src/dataText/dataHomeForm';

interface children {
    children: ReactElement;
}

const Globalestyle: React.FC<children> = ({ children }) => {
    return children;
};

export default Globalestyle;
