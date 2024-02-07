import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import { CloseI, SelectLinkI, TextBoldI, TextEditorI, WriteLinkI } from '~/assets/Icons/Icons';
import { DivPos } from '~/reUsingComponents/styleComponents/styleComponents';
import { Div, H3, P } from '~/reUsingComponents/styleComponents/styleDefault';
import { PropsValueQuill } from '../FormUpNews';

const TextEditor: React.FC<{
    valueText: string;
    font: string;
    setOnEditor: React.Dispatch<React.SetStateAction<boolean>>;
    setInputValue: React.Dispatch<React.SetStateAction<string>>;
    quillRef: React.RefObject<ReactQuill>;
    valueQuill: React.MutableRefObject<PropsValueQuill>;
}> = ({ valueText, font, setOnEditor, setInputValue, quillRef, valueQuill }) => {
    const data = [
        {
            id: 3,
            text: '',
            color: '#63b6ff',
            icon: <WriteLinkI />,
            onClick: () => {
                if (valueQuill.current.url && valueQuill.current.quill) {
                    valueQuill.current.quill.format('link', valueQuill.current.url);
                    valueQuill.current.quill.format('color', '#66a6de');
                    // Show the URL input div

                    setInputValue(valueQuill.current.quill.root.innerHTML);
                }
            },
        },
        {
            id: 4,
            text: '',
            color: '#63b6ff',
            icon: <SelectLinkI />,
            onClick: () => {
                if (valueQuill.current.url && valueQuill.current.quill) {
                    valueQuill.current.quill.format('link', valueQuill.current.url);
                    valueQuill.current.quill.format('color', '#66a6de');
                    // Update the Quill editor's content
                    // Update the Quill editor's content
                    setInputValue(valueQuill.current.quill.root.innerHTML);
                }
            },
        },
        {
            id: 5,
            text: '',
            color: 'aliceblue',
            icon: <TextBoldI />,
            onClick: () => {
                // Surround the selected text with the created span element https://nega #hung yes me #hung
                if (quillRef.current) {
                    const quill = quillRef.current.editor;
                    // Apply bold style to selected text or at the cursor position
                    if (quill) {
                        quill.format('bold', true); // This sets bold style
                        // Update the Quill editor's content
                        setInputValue(quill.root.innerHTML);
                    }
                }
            },
        },
    ];
    const textRef = useRef<any>(null);
    const [range, setRange] = useState<Range | null>(null);
    const handleSelect = () => {
        const myElement = document.getElementById('myElementId');
        if (myElement) {
            const selection = myElement.ownerDocument.getSelection();
            if (selection && selection.rangeCount > 0) {
                const rg = selection.getRangeAt(0);
                if (rg) {
                    const selectedText = rg.toString();
                    if (selectedText && selectedText !== ' ') {
                        console.log(selectedText, 'start');
                        setRange(rg);
                        // Set the background color
                    } else {
                        if (range) setRange(null);
                    }
                }
            }
        }
    };
    return (
        <Div
            css={`
                position: fixed;
                width: 100%;
                background-color: #1d1d1da8;
                z-index: 9999;
                top: 0;
                left: 0;
                align-items: end;
                @media (min-width: 500px) {
                    width: 98%;
                    z-index: 0;
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
                        <Div
                            key={tor.id}
                            css={`
                                cursor: var(--pointer);
                                margin: 0 2px;
                                &:hover {
                                    color: ${tor.color};
                                }
                            `}
                            onClick={tor.onClick}
                        >
                            {tor.icon}
                        </Div>
                    ))}
                </Div>
            </Div>
        </Div>
    );
};

export default TextEditor;
