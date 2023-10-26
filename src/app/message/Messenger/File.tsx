import { useEffect, useLayoutEffect, useState } from 'react';
import { Player } from 'video-react';
import { ImageI } from '~/assets/Icons/Icons';
import { Div, Img, P } from '~/reUsingComponents/styleComponents/styleDefault';
import sendChatAPi from '~/restAPI/chatAPI';
import CommonUtils from '~/utils/CommonUtils';

const FileConversation: React.FC<{
    del: React.MutableRefObject<HTMLDivElement | null>;
    type?: string;
    v: string;
    icon: string;
    ERef: any;
    who?: string;
}> = ({ type = '', v, icon, ERef, del, who }) => {
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
    console.log(type.search('image/') >= 0, type.search('image/'), type, 'check file');

    return (
        <Div
            css={`
                min-width: 79px;
                width: 79px;
                border-radius: 5px;
                border: 2px solid #202124;
                flex-grow: 1;
                position: relative;
                justify-content: ${who === 'you' ? 'right' : 'left'};
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
            {v.includes('exist') ? (
                <P
                    z="1.2rem"
                    css={`
                        width: fit-content;
                        margin: 0;
                        padding: 2px 12px 4px;
                        border-radius: 7px;
                        border-top-left-radius: 13px;
                        border-bottom-left-radius: 13px;
                        display: flex;
                        align-items: center;
                        background-color: #1d1c1c;
                        border: 1px solid #4e4d4b;
                        svg {
                            margin-right: 3px;
                        }
                    `}
                >
                    <ImageI />
                    {v}
                </P>
            ) : type.search('image/') >= 0 ? (
                <Img id="roomImageChat" src={v} radius="5px" onClick={(e) => e.stopPropagation()} />
            ) : (
                <Player src={v} />
            )}
        </Div>
    );
};
export default FileConversation;
