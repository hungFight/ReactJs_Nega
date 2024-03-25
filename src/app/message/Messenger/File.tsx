import { useEffect, useLayoutEffect, useState } from 'react';
import { ImageI } from '~/assets/Icons/Icons';
import Player from '~/reUsingComponents/Videos/Player';
import { DivPos } from '~/reUsingComponents/styleComponents/styleComponents';
import { Div, Img, P } from '~/reUsingComponents/styleComponents/styleDefault';
import sendChatAPi from '~/restAPI/chatAPI';
import CommonUtils from '~/utils/CommonUtils';

const FileConversation: React.FC<{
    id_pre?: string;
    id_room?: string;
    type?: string;
    icon?: string;
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
}> = ({ type = '', setRoomImage, roomImage, id_room, id_file, fixed, id_pre }) => {
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
            {type === 'image' ? (
                <Img
                    id="roomImageChat"
                    src={id_pre ? id_pre : `${process.env.REACT_APP_SERVER_FILE_GET_IMG_V1}/${id_file}`}
                    radius="5px"
                />
            ) : (
                <Player
                    src={id_pre ? id_pre : `${process.env.REACT_APP_SERVER_FILE_GET_IMG_V1}/${id_file}`}
                    radius="5px"
                />
            )}
        </Div>
    );
};
export default FileConversation;
