import React, { useEffect, useRef, useState } from 'react';
import { CloseI, TextBoldI, TextEditorI } from '~/assets/Icons/Icons';
import { DivPos } from '~/reUsingComponents/styleComponents/styleComponents';
import { Div, H3, P } from '~/reUsingComponents/styleComponents/styleDefault';

const TextEditor: React.FC<{
    valueText: string;
    font: string;
    setOnEditor: React.Dispatch<React.SetStateAction<boolean>>;
    setInputValue: React.Dispatch<
        React.SetStateAction<{
            dis: string;
            textarea: string;
        }>
    >;
}> = ({ valueText, font, setOnEditor, setInputValue }) => {
    const data = [
        {
            id: 1,
            text: '',
            icon: <TextBoldI />,
            onClick: () => {
                if (range) {
                    // Surround the selected text with the created span element
                    const span = document.createElement('span');
                    span.style.fontWeight = 'bold';
                    range.surroundContents(span);
                    const updatedHTMLContent = textRef.current.innerHTML;
                    // Update the state with the styled HTML content
                    setInputValue((prevInputValue) => ({
                        ...prevInputValue,
                        dis: updatedHTMLContent,
                    }));
                }
            },
        },
    ];
    const textRef = useRef<any>(null);
    const [range, setRange] = useState<Range | null>(null);
    const handleSelect = () => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const rg = selection.getRangeAt(0);
            const selectedText = rg.toString();
            if (selectedText && selectedText.trim() !== '') {
                setRange(rg);
                // Set the background color
            }
        }
    };
    return (
        <Div
            css={`
                position: fixed;
                width: 100%;
                height: 100%;
                background-color: #1d1d1da8;
                z-index: 9999;
                top: 0;
                left: 0;
                align-items: end;
                @media (min-width: 500px) {
                    width: 98%;
                    z-index: 0;
                    height: 400px;
                    translate: unset;
                    margin-top: 11px;
                    position: unset;
                }
            `}
            onClick={(e) => {
                e.stopPropagation();
            }}
            onTouchStart={(e) => e.stopPropagation()}
        >
            <Div
                width="100%"
                display="block"
                css={`
                    height: 100%;
                    padding: 0 0 5px 0;
                    position: relative;
                    background-color: #2a2a2a;
                    @media (min-width: 500px) {
                        height: 100%;
                        box-shadow: 0 0 3px #60a6c7;
                        border-radius: 5px;
                        background-color: #18191b;
                    }
                `}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                {' '}
                <H3
                    css={`
                        width: 100%;
                        margin: 3px 0;
                        justify-content: center;
                        padding: 2px 4px;
                        font-size: 1.6rem;
                        display: flex;
                        align-items: center;
                        position: relative;
                    `}
                >
                    <Div css="margin-right: 5px">
                        <TextEditorI />
                    </Div>{' '}
                    Editor
                    <DivPos size="25px" top="3px" left="10px" onClick={() => setOnEditor(false)}>
                        <CloseI />
                    </DivPos>
                </H3>
                <Div width="80%" css="margin: 10px auto; padding: 10px; border: 1px solid #595959;border-radius: 5px;">
                    {data.map((tor) => (
                        <Div key={tor.id} css="cursor: var(--pointer);" onClick={tor.onClick}>
                            {tor.icon}
                        </Div>
                    ))}
                </Div>
                <Div css="justify-content: center;">
                    {valueText && (
                        <P
                            id="myElementId"
                            onMouseUp={handleSelect}
                            ref={textRef}
                            css={`
                                padding: 5px;
                                background-color: #292a2d;
                                font-family: ${font}, sans-serif;
                                white-space: pre-wrap;
                                word-break: break-word;
                                font-size: 1.5rem;
                                @media (min-width: 768px) {
                                    font-size: 1.38rem;
                                }
                            `}
                            dangerouslySetInnerHTML={{ __html: valueText }}
                        ></P>
                    )}
                </Div>
            </Div>
        </Div>
    );
};

export default TextEditor;
