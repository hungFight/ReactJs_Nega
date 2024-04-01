import React from 'react';
import { ReactQuillF } from '../styleComponents/styleComponents';
import ReactQuill from 'react-quill';
import { PropsValueQuill } from '~/social_network/components/Header/layout/Home/Layout/FormUpNews/FormUpNews';

const QuillText: React.FC<{
    quillRef: React.RefObject<ReactQuill>;
    onChange: (value: string) => void;
    valueText: string;
    consider: React.MutableRefObject<number>;
    valueQuill: React.MutableRefObject<PropsValueQuill>;
    setInsertURL: (value: React.SetStateAction<boolean>) => void;
    insertURL: boolean;
    tagDivURL: React.MutableRefObject<HTMLDivElement | null>;
    css: string;
}> = ({ quillRef, onChange, valueText, consider, valueQuill, setInsertURL, insertURL, tagDivURL, css }) => {
    return (
        <ReactQuillF
            ref={quillRef}
            onChange={onChange}
            placeholder="comment"
            value={valueText}
            onChangeSelection={(range) => {
                if (quillRef.current) {
                    const quill = quillRef.current.editor;
                    // Apply bold style to selected text or at the cursor position
                    if (quill) {
                        const selectionRange = quill.getSelection();
                        if (selectionRange) {
                            const selectedText = quill.getText(selectionRange.index, selectionRange.length);
                            const urlRegex = /https:\/\/(?!<a>)[^\s]+/g;
                            if (selectedText) {
                                consider.current = 0;
                                console.log(consider.current, 'consider.current 1');
                                valueQuill.current.text = selectedText;
                                if (selectedText.match(urlRegex)?.length) valueQuill.current.url = selectedText;
                                valueQuill.current.quill = quill;
                            } else {
                                valueQuill.current.url = '';
                                valueQuill.current.quill = null;
                                valueQuill.current.text = '';
                                if (insertURL) setInsertURL(false);
                            }
                        } else {
                            consider.current += 1;
                            // valueQuill.current.url = '';
                            // valueQuill.current.quill = null;
                            // valueQuill.current.text = '';
                            // if (insertURL) setInsertURL(false);
                        }
                    }
                }
                if (tagDivURL) {
                    tagDivURL.current?.addEventListener('click', (e) => {
                        if (consider.current !== 1) {
                            valueQuill.current.quill = null;
                            valueQuill.current.text = '';
                            if (insertURL) setInsertURL(false);
                        }
                    });
                }
                console.log(consider.current, 'consider.current 2');
            }}
            modules={{
                toolbar: false, // Tắt thanh công cụ
            }}
            css={css + '.ql-clipboard {display: none;}'}
        />
    );
};

export default QuillText;
