import React, { useEffect, useRef, useState } from 'react';
import { CheckI, CloseI, ProfileI } from '~/assets/Icons/Icons';
import { DivFlexPosition } from '~/reUsingComponents/styleComponents/styleComponents';
import { Div, H3, Input } from '~/reUsingComponents/styleComponents/styleDefault';
import peopleAPI from '~/restAPI/socialNetwork/peopleAPI';
import { PropsFriends } from '../../../../MakingFriends/Friends';
import Account from '~/Pages/social_network/Accoutns/Account';
import { useDispatch, useSelector } from 'react-redux';
import { InitialStateHideShow, setOpenProfile } from '~/redux/hideShow';

const Tags: React.FC<{
    colorText: string;
    setOnTagU: React.Dispatch<React.SetStateAction<boolean>>;
    setTags: React.Dispatch<
        React.SetStateAction<
            {
                id: string;
                avatar: string;
                gender: number;
                fullName: string;
            }[]
        >
    >;
    tags: {
        id: string;
        avatar: string;
        gender: number;
        fullName: string;
    }[];
}> = ({ colorText, setOnTagU, setTags, tags }) => {
    const offsetRef = useRef<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const { openProfile } = useSelector((state: { hideShow: InitialStateHideShow }) => state.hideShow);
    const [limit, setLimit] = useState(10);
    const eleRef = useRef<any>();
    const [data, setData] = useState<PropsFriends[]>([]);
    const dataRef = useRef<any>([]);
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchFriends() {
            const dataRes = await peopleAPI.getFriends(dispatch, offsetRef.current, limit, 'friends');
            if (dataRes) {
                dataRef.current = [...(dataRef.current ?? []), ...dataRes];
                setData(dataRef.current);
                offsetRef.current += limit;
                setLoading(false);
            }
        }
        fetchFriends();
    }, []);
    console.log(tags, 'tags');

    const handleScroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = eleRef.current;
        console.log(scrollTop, clientHeight, scrollHeight);

        if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
            //  fetch(false);
        }
    };
    const [hashTag, setHashTag] = useState<string>('');
    return (
        <Div
            css={`
                position: fixed;
                width: 100%;
                height: 100%;
                z-index: ${openProfile.newProfile.length > 0 ? 8 : 9999};
                top: 0px;
                left: 0;
                align-items: center;
                @media (min-width: 500px) {
                    width: 98%;
                    height: 400px;
                    translate: unset;
                    margin-top: 11px;
                    position: unset;
                    z-index: 1;
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
                <Div width="100%" wrap="wrap" css="box-shadow: 0 0 3px #0d0d0d; margin-bottom: 5px">
                    <H3
                        css={`
                            width: 100%;
                            box-shadow: 0px 0px 5px 0px black;
                            justify-content: center;
                            padding: 10px 4px;
                            font-size: 1.5rem;
                            display: flex;
                            align-items: center;
                            position: relative;
                            @media (min-width: 500px) {
                                box-shadow: unset;
                            }
                        `}
                    >
                        Tag
                        <DivFlexPosition size="25px" top="8px" left="10px" onClick={() => setOnTagU((pre) => !pre)}>
                            <CloseI />
                        </DivFlexPosition>
                    </H3>
                    <Div width="80%" css="margin: auto;">
                        <Input placeholder="Search" color={colorText} />
                    </Div>
                </Div>
                <Div width="100%" wrap="wrap" css="padding: 0 5px;">
                    {data.map((r) => (
                        <Account
                            key={r.id}
                            data={r}
                            onClick={() => {
                                setTags((pre) => {
                                    if (!pre.some((v) => v.id === r.id)) {
                                        return [...pre, { id: r.id, avatar: r.avatar, fullName: r.fullName, gender: r.gender }];
                                    } else {
                                        pre = pre.filter((v) => v.id !== r.id);
                                        return pre;
                                    }
                                });
                            }}
                            Element={
                                <>
                                    <DivFlexPosition
                                        top="12.5px"
                                        right="57px"
                                        size="30px"
                                        css="color: #a4dff1;"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dispatch(setOpenProfile({ newProfile: [r.id], currentId: '' }));
                                        }}
                                    >
                                        <ProfileI />
                                    </DivFlexPosition>
                                    <DivFlexPosition
                                        top="15px"
                                        right="22px"
                                        width="23px"
                                        css={`
                                            border: 2px solid ${tags.some((v) => v.id === r.id) ? '#7bf05e' : '#a7a7a7'};
                                            border-radius: 3px;
                                        `}
                                    >
                                        {tags.some((v) => v.id === r.id) && (
                                            <Div
                                                css={`
                                                    color: #7bf05e;
                                                `}
                                            >
                                                <CheckI />
                                            </Div>
                                        )}
                                    </DivFlexPosition>
                                </>
                            }
                        />
                    ))}
                </Div>
            </Div>
        </Div>
    );
};

export default Tags;
