import { useEffect, useLayoutEffect, useState } from 'react';
import { Div, Img } from '~/reUsingComponents/styleComponents/styleDefault';
import sendChatAPi from '~/restAPI/chatAPI';
import CommonUtils from '~/utils/CommonUtils';

const FileConversation: React.FC<{
    del: React.MutableRefObject<HTMLDivElement | null>;
    type?: string;
    v: string;
    icon: string;
    ERef: any;
}> = ({ type = '', v, icon, ERef, del }) => {
    const handleRoom = (e: any) => {
        e.stopPropagation();
        if (e.target.getAttribute('class').includes('roomOfChat')) {
            e.target.classList.remove('roomOfChat');
            del.current?.setAttribute('style', 'z-index: 99');
        } else {
            e.target.classList.add('roomOfChat');
            del.current?.setAttribute('style', 'z-index: 100');
        }
    };
    return (
        <Div
            css={`
                min-width: 79px;
                width: 79px;
                border-radius: 5px;
                border: 2px solid #202124;
                flex-grow: 1;
                position: relative;
                &::after {
                    display: block;
                    content: '';
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                }
            `}
            onClick={handleRoom}
        >
            <Img id="roomImageChat" src={v} radius="5px" onClick={(e) => e.stopPropagation()} />
        </Div>
    );
};
export default FileConversation;
