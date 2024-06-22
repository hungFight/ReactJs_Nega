import { Player } from 'video-react';
import { useState } from 'react';

import { Div, Img } from '~/reUsingComponents/styleComponents/styleDefault';
import LogicType from './logicType';
import FullScreenSildes from './FullScreenSildes/FullScreenSildes';
import { PropsDataFileUpload } from '../../FormUpNews';

const Grid: React.FC<{
    column: number;
    file: PropsDataFileUpload[];
    step: number;
    setStep: React.Dispatch<React.SetStateAction<number>>;
    colorText: string;
    bg: string;
    setBg: React.Dispatch<React.SetStateAction<string>>;
}> = ({ column, file, step, setStep, colorText, bg, setBg }) => {
    const { moreFile, cc, handleStep, setMoreFile, ToolDefault, showTitle, update, setUpdate, showComment, setShowComment } = LogicType(step, setStep, colorText);
    const [showColors, setShowColors] = useState(false);
    let columns = '';
    if (column) {
        for (let i = 0; i < column; i++) {
            columns += '1fr ';
        }
    }
    const colors = [
        { id: 1, color: '#1b1919' },
        { id: 2, color: '#fcfcfc' },
        { id: 3, color: 'antiquewhite' },
        { id: 4, color: 'coral' },
        { id: 5, color: '#e37bb5' },
        { id: 6, color: '#7185e1' },
        { id: 7, color: '#71cbe1' },
    ];

    return (
        <Div
            width="100%"
            css={`
                max-height: 500px;
                margin: 4px 0;
                background-color: ${bg};
                ${step === 1 ? 'position: fixed; max-height:100%; top: 0; left: 0; width: 100%; height: 99%; z-index: 12; overflow-y: overlay;' : ''}
            `}
        >
            {' '}
            {step > 0 && ToolDefault(0)}
            {cc !== null && <FullScreenSildes step={step} cc={cc} files={file} />}
            {step === 2 && ToolDefault(2)}
            <Div
                width="100%"
                css={`
                    height: fit-content;
                    display: grid;
                    gap: 2px;
                    border-radius: 5px;
                    padding: 2px 9px;
                    grid-template-columns: ${file.length === 1 ? '1fr' : columns};
                `}
            >
                <>{step === 2 && ToolDefault(2)}</>
                {file.map((f, index) => {
                    return (
                        <Div
                            key={index}
                            width="100%"
                            css={`
                                height: 100%;
                                margin: 0 1.5px;
                                border-radius: 5px;
                                /* ${step > 1
                                    ? `position: fixed; top: 0; left:0; z-index: 88; background-color: #0e0e0d; img,div.video-react-controls-enabled{object-fit: contain; margin: auto;}`
                                    : ''} */
                                ${f.type === 'video' && file.length === 1 ? 'height: 580px;' : ''}
                            `}
                            onClick={(e) => handleStep(e, index)}
                        >
                            {f.type.includes('image') ? <Img src={f.link} alt={f.link} radius="5px" /> : f.type.includes('video') ? <Player src={f.link} /> : ''}
                        </Div>
                    );
                })}
            </Div>
        </Div>
    );
};
export default Grid;
