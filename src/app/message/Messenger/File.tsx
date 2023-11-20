import { useEffect, useLayoutEffect, useState } from 'react';
import { ImageI } from '~/assets/Icons/Icons';
import Player from '~/reUsingComponents/Videos/Player';
import { DivPos } from '~/reUsingComponents/styleComponents/styleComponents';
import { Div, Img, P } from '~/reUsingComponents/styleComponents/styleDefault';
import sendChatAPi from '~/restAPI/chatAPI';
import CommonUtils from '~/utils/CommonUtils';

const FileConversation: React.FC<{
    del: React.MutableRefObject<HTMLDivElement | null>;
    id_room?: string;
    type?: string;
    v: string;
    icon?: string;
    ERef?: any;
    who?: string;
    roomImage?:
        | {
              id_room: string;
              id_file: string;
          }
        | undefined;
    id_file?: string;
    setRoomImage?: React.Dispatch<
        React.SetStateAction<
            | {
                  id_room: string;
                  id_file: string;
              }
            | undefined
        >
    >;
    fixed?: boolean;
    room?: boolean;
}> = ({ type = '', v, icon, ERef, del, who, setRoomImage, roomImage, id_room, id_file, fixed }) => {
    const image = type.search('image/') >= 0;
    console.log(image, 'image', type, type.search('image/'));

    useEffect(() => {
        // if (v.length < 50 && !v.search('data')) setReload(true); // check data format
    }, [v]);
    return (
        <Div
            className={`${roomImage?.id_file === id_file && fixed ? 'roomOfChat' : 'roomIf'} `}
            css={`
                min-width: 79px;
                width: 79px;
                border-radius: 5px;
                border: 2px solid #202124;
                flex-grow: 1;
                position: relative;
                user-select: none;
                &::after {
                    display: block;
                    content: '';
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                }
                z-index: ${roomImage?.id_file === id_file ? 0 : 1};
            `}
            onClick={(e) => {
                if (setRoomImage) e.stopPropagation();
                if (id_file && id_room && setRoomImage && roomImage?.id_file !== id_file)
                    setRoomImage({ id_file, id_room });
                if (roomImage?.id_file === id_file && setRoomImage) setRoomImage(undefined);
            }}
        >
            {roomImage && roomImage?.id_file === id_file && !fixed && (
                <DivPos
                    width="100%"
                    css="height: 100%; background-color: #0000009e; border-radius: 0px;"
                    top="0"
                    left="0"
                    size="1.2rem"
                >
                    previewing
                </DivPos>
            )}
            {v?.search('exist') >= 0 ? ( // notify info when file doesn't exist
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
                        div {
                            z-index: 1;
                        }
                    `}
                >
                    <ImageI />
                    {v}
                </P>
            ) : image ? (
                <Img id="roomImageChat" src={v} radius="5px" />
            ) : (
                <Player src={v} radius="5px" />
            )}
        </Div>
    );
};
export default FileConversation;
