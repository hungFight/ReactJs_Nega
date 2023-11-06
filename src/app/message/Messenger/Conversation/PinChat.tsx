import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { PropsUser } from 'src/App';
import { ArrowDownI, ClockCirclesI, DotI, GarbageI } from '~/assets/Icons/Icons';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
import Player from '~/reUsingComponents/Videos/Player';
import Languages from '~/reUsingComponents/languages';
import { DivPos } from '~/reUsingComponents/styleComponents/styleComponents';
import { Div, Img, P } from '~/reUsingComponents/styleComponents/styleDefault';
import { setOpenProfile } from '~/redux/hideShow';
import chatAPI from '~/restAPI/chatAPI';
import gridFS from '~/restAPI/gridFS';
import CommonUtils from '~/utils/CommonUtils';
import ServerBusy from '~/utils/ServerBusy';
import { decrypt } from '~/utils/crypto';

const PinChat: React.FC<{
    pins: {
        chatId: string;
        userId: string;
        createdAt: string;
    }[];
    conversationId: string;
    avatar?: string;
    name: string;
    dataFirst: PropsUser;
    user: {
        id: string;
        fullName: string;
        avatar: string | undefined;
        gender: number;
    };
    setChoicePin: React.Dispatch<React.SetStateAction<string>>;
}> = ({ conversationId, pins, avatar, name, user, dataFirst, setChoicePin }) => {
    const [more, setMore] = useState<boolean>(false);
    const { lg } = Languages();
    const dispatch = useDispatch();
    const { data } = useQuery({
        queryKey: ['Pins chat', conversationId],
        cacheTime: 60 * 1000,
        queryFn: async () => {
            const rr: {
                _id: string;
                id: string;
                text: { icon: string; t: string };
                imageOrVideos: { v: string; icon: string; _id: string; type: string }[];
                seenBy: string[];
                secondary?: string;
                createdAt: string;
                delete?: string;
            }[] = await chatAPI.getPins(
                conversationId,
                pins.map((r) => r.chatId),
            );
            const da: typeof rr = ServerBusy(rr, dispatch);

            const newR: typeof rr = await new Promise(async (resolve, reject) => {
                await Promise.all(
                    da.map(async (d, index) => {
                        if (d.text.t)
                            d.text.t = decrypt(d.text.t, `chat_${d?.secondary ? d.secondary : conversationId}`);
                        await Promise.all(
                            d.imageOrVideos.map(async (f, index2) => {
                                const aa = await gridFS.getFile(f.v, f?.type);
                                const buffer = ServerBusy(aa, dispatch);
                                if (aa?.message === 'File not found') {
                                    rr[index].imageOrVideos[index2].v =
                                        aa?.type?.search('image/') >= 0 ? "Image doesn't exist" : "Video doesn't exist";
                                } else {
                                    const base64 = CommonUtils.convertBase64GridFS(buffer);
                                    rr[index].imageOrVideos[index2].v = base64;
                                }
                            }),
                        );
                    }),
                );
                resolve(rr);
            });
            return newR;
        },
    });
    return (
        <Div
            css={`
                position: absolute;
                top: 50px;
                left: 0;
                width: 100%;
                background-color: #030303c4;
                transition: all 0.5s linear;
                z-index: 12;
                padding: 5px;
                ${more ? 'max-height: 81%; ' : 'max-height: 39px;'}
            `}
        >
            <Div width={more ? '100%' : '93%'} css="position: relative;">
                <DivPos
                    top="-8px"
                    left="-7px"
                    css={`
                        transform: rotate(297deg);
                    `}
                >
                    📌
                </DivPos>
                <DivPos top="17px" left="5px" css="font-size: 1.2rem;">
                    {pins.length}
                </DivPos>
                <Div width="100%" display="block" wrap="wrap" css="overflow-y: overlay; justify-content: center; ">
                    {data?.map((r) => {
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
                                key={r._id}
                                width="100%"
                                css="margin: 2px 0; cursor: var(--pointer); align-items: center; background-color: #19191aa6; padding: 5px 10px; padding-left: 22px; justify-content: space-between; &:hover{background-color:#313131;}"
                                onClick={() => setChoicePin(r._id)}
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
                                            <P z="1.2rem" css="overflow: hidden; width: max-content;">
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
                                <Div>
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
                    })}
                </Div>
            </Div>
            <Div
                css={`
                    justify-content: center;
                    align-items: center;
                    cursor: var(--pointer);
                    ${more
                        ? 'position: absolute; transform: rotate(178deg); right: 8px; top: 16px; height: 30px; width: 30px; font-size: 20px; background-color: #2b2b2bf2; border-radius: 50%;'
                        : 'width: 7%;'}
                `}
                onClick={() => setMore(!more)}
            >
                <ArrowDownI />
            </Div>
        </Div>
    );
};

export default PinChat;
