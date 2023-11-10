import React, { useRef, useState } from 'react';
import { ClockCirclesI, GarbageI } from '~/assets/Icons/Icons';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
import { Div, Img, P } from '~/reUsingComponents/styleComponents/styleDefault';
import { PropsChat, PropsPinC, PropsRooms } from './LogicConver';
import { PropsUser } from 'src/App';
import { useDispatch } from 'react-redux';
import { setOpenProfile } from '~/redux/hideShow';
import moment from 'moment';
import Languages from '~/reUsingComponents/languages';
import Player from '~/reUsingComponents/Videos/Player';
import chatAPI from '~/restAPI/chatAPI';
import { UseMutationResult } from '@tanstack/react-query';

const ItemPin: React.FC<{
    setChoicePin: React.Dispatch<React.SetStateAction<string>>;
    r: PropsRooms;
    pins: PropsPinC[];
    dataFirst: PropsUser;
    user: {
        id: string;
        fullName: string;
        avatar: string | undefined;
        gender: number;
    };
    conversationId: string;
    // Cập nhật cache tạm thời với dữ liệu mới
    removePin: UseMutationResult<
        {
            roomId: string;
            pinId: String;
        },
        unknown,
        {
            roomId: string;
            pinId: String;
        },
        {
            previousData: PropsRooms[] | undefined;
        }
    >;

    coordS: React.MutableRefObject<number>;
    coord: React.MutableRefObject<number>;
    setConversation: React.Dispatch<React.SetStateAction<PropsChat | undefined>>;
}> = ({ setChoicePin, r, pins, dataFirst, user, conversationId, removePin, coordS, setConversation, coord }) => {
    const dispatch = useDispatch();
    const { lg } = Languages();
    const elem = useRef<HTMLDivElement | null>(null);

    const coordinate = useRef<number | null>(null);
    const handleMove = (e: any) => {
        if (coordinate.current !== null && elem.current) {
            if (coordS.current >= 175 || coordS.current <= -175) {
                elem.current.style.backgroundColor = '#4d1c1c';
            } else {
                elem.current.style.backgroundColor = '#19191aa6';
            }
            coordS.current = (e.clientX || e?.changedTouches[0]?.clientX) - coordinate.current;
            elem.current.style.left = `${(e.clientX || e?.changedTouches[0]?.clientX) - coordinate.current}px`;
        }
    };
    const handleMouseDown = (e: any) => {
        coord.current = 1;
        coordinate.current = e.clientX || e?.changedTouches[0]?.clientX;
    };
    const handleMouseUp = async (e: any) => {
        coordinate.current = null;
        if (coordS.current >= 175 || coordS.current <= -175) {
            if (elem.current) {
                elem.current.style.backgroundColor = '';
                elem.current.style.transition = 'all 0.3s linear';
                elem.current.style.left = '500px';
            }

            const _id = pins.filter((p) => p.chatId === r._id)[0]._id;
            coordS.current = 0;
            const res = await chatAPI.deletePin(conversationId, _id, r._id);
            if (res) {
                removePin.mutate({ roomId: r._id, pinId: _id });
            }
            coord.current = 0;
        } else {
            if (elem.current) {
                elem.current.style.backgroundColor = '';
                elem.current.style.left = '0px';
            }
        }
    };
    const handleMouseLeave = async (e: any) => {
        coordinate.current = null;

        if (coordS.current >= 175 || coordS.current <= -175) {
            if (elem.current) {
                elem.current.style.backgroundColor = '';
                elem.current.style.transition = 'all 0.3s linear';
                elem.current.style.left = '500px';
            }
            const _id = pins.filter((p) => p.chatId === r._id)[0]._id;
            coordS.current = 0;
            const res = await chatAPI.deletePin(conversationId, _id, r._id);
            if (res) {
                removePin.mutate({ roomId: r._id, pinId: _id });
            }
            coord.current = 0;
        } else {
            if (elem.current) {
                elem.current.style.backgroundColor = '';
                elem.current.style.left = '0px';
            }
        }
    };

    const pin = pins.filter((p) => p.chatId === r._id)[0];
    const whoText =
        pin.chatId === r._id && r.id === dataFirst.id // name of that chat
            ? dataFirst.fullName
            : r.id === user.id
            ? user.fullName
            : '';
    const whoAvatar =
        pin.chatId === r._id && r.id === dataFirst.id // avatar of that chat
            ? dataFirst.avatar
            : r.id === user.id
            ? user.avatar
            : '';
    const gender =
        pin.chatId === r._id && r.id === dataFirst.id // gender of that chat
            ? dataFirst.gender
            : r.id === user.id
            ? user.gender
            : 0;
    return (
        <Div
            ref={elem}
            key={r._id}
            id={`pin_move_op_${r._id}`}
            className="pin_move_op"
            width="100%"
            css="margin: 2px 0; position: relative; overflow: auto; cursor: var(--pointer); align-items: center; background-color: #19191aa6; padding: 5px 10px; padding-left: 22px; justify-content: space-between; &:hover{background-color:#313131;}"
            onClick={() => {
                if (coord.current === 0) setChoicePin(r._id);
            }}
            onMouseMove={handleMove}
            onTouchMove={handleMove}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchEnd={handleMouseUp}
            onTouchCancel={handleMouseLeave}
            onMouseLeave={handleMouseLeave}
        >
            <Div width="73%" css="align-items: center; max-width: 73%;">
                <Avatar
                    src={whoAvatar}
                    alt={whoText}
                    radius="50%"
                    gender={gender}
                    css={`
                        width: 20px;
                        height: 20px;
                        margin-right: 8px;
                        min-width: 20px;
                    `}
                />
                <Div css="align-items: center;" wrap="wrap">
                    <Div width="100%" css="align-items: center; ">
                        <P z="1.2rem" css="text-wrap: nowrap; margin-right: 3px;">
                            {whoText}:
                        </P>
                        <P z="1.2rem" css="overflow: hidden; width: 67%; ">
                            {r.text.t}
                            {r?.delete && <GarbageI />}
                            {r?.delete && r.id === dataFirst.id
                                ? "You've deleted"
                                : r.id === user.id && r?.delete === 'all'
                                ? `${user.fullName} has deleted`
                                : ''}
                        </P>
                    </Div>
                    <P
                        z="1rem"
                        css="display: flex;  color: #828282; svg{margin-top: 2px;margin-right: 5px;};width: 100%;"
                    >
                        <ClockCirclesI /> {moment(pin.createdAt).locale(lg).format('lll')}
                    </P>
                    <P z="1.2rem" css="text-wrap: nowrap; margin-right: 3px; color: #828282; ">
                        pined by:{' '}
                    </P>
                    <P
                        z="1.2rem"
                        css="text-wrap: nowrap; color: #828282; &:hover{color: #cccccc;text-decoration: underline;}"
                        onClick={() => dispatch(setOpenProfile({ newProfile: [pin.userId] }))}
                    >
                        {pin.userId === dataFirst.id // be pined by who
                            ? dataFirst.fullName
                            : pin.userId === user.id
                            ? user.fullName
                            : ''}
                    </P>
                </Div>
            </Div>
            <Div wrap="wrap" width="27%">
                {r.imageOrVideos.map((f) => (
                    <Div key={f._id} width="30px" css="height: 30px; margin: 2px; ">
                        {f.type.search('image/') >= 0 ? (
                            <Img src={f.v} alt={f._id} radius="5px" />
                        ) : (
                            <Player src={f.v} />
                        )}
                    </Div>
                ))}
            </Div>
        </Div>
    );
};

export default ItemPin;
