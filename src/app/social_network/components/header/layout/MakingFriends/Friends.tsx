import { DotI, LoadingI } from '~/assets/Icons/Icons';
import { Div, H3 } from '~/reUsingComponents/styleComponents/styleDefault';
import TagProfle from './TagProfile';
import { useCookies } from 'react-cookie';
import { useEffect, useRef, useState } from 'react';
import peopleAPI from '~/restAPI/socialNetwork/peopleAPI';
import CommonUtils from '~/utils/CommonUtils';
import { useDispatch, useSelector } from 'react-redux';
import { DivResults } from './styleMakingFriends';
import { DivLoading } from '~/reUsingComponents/styleComponents/styleComponents';
import { PropsBgRD } from '~/redux/background';
import ServerBusy from '~/utils/ServerBusy';
import { PropsId_chats } from 'src/App';
import { PropsRoomsChatRD, onChats } from '~/redux/roomsChat';
export interface PropsFriends {
    avatar: any;
    birthday: string;
    fullName: string;
    gender: number;
    id: string;
}
const Friends: React.FC<{
    type: string;
    setId_chats: React.Dispatch<React.SetStateAction<PropsId_chats[]>>;
}> = ({ type, setId_chats }) => {
    const dispatch = useDispatch();
    const reload = useSelector((state: { reload: { people: number } }) => state.reload.people);
    const { chats } = useSelector((state: PropsRoomsChatRD) => state.persistedReducer.roomsChat);

    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<PropsFriends[]>();

    const offsetRef = useRef<number>(0);
    const [limit, setLimit] = useState(10);
    const cRef = useRef<number>(0);
    const eleRef = useRef<any>();
    const dataRef = useRef<any>([]);

    async function fetch(rel: boolean) {
        cRef.current = 1;
        if (rel) {
            // for scroll
            offsetRef.current = 0;
            dataRef.current = [];
            setLoading(true);
        }

        const res = await peopleAPI.getFriends(offsetRef.current, limit, 'friends');
        const data = ServerBusy(res, dispatch);
        console.log('friends', data);
        data.map((f: { avatar: string | undefined }) => {
            if (f.avatar) {
                const av = CommonUtils.convertBase64(f.avatar);
                f.avatar = av;
            }
        });
        if (data) {
            dataRef.current = [...(dataRef.current ?? []), ...data];
            setData(dataRef.current);
            offsetRef.current += limit;
            setLoading(false);
        }
    }

    const handleScroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = eleRef.current;
        console.log(scrollTop, clientHeight, scrollHeight);

        if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
            fetch(false);
        }
    };
    useEffect(() => {
        if (type === 'friends' || cRef.current === 0) fetch(true);
        eleRef.current.addEventListener('scroll', handleScroll);
        return () => {
            eleRef?.current?.removeEventListener('scroll', handleScroll);
        };
    }, [reload]);
    const handleMessenger = (id: string) => {
        dispatch(onChats({ id_room: undefined, id_other: id }));
        setId_chats((pre) => {
            if (!chats.some((p) => p.id_other === id) && !pre.some((p) => p.id_other === id)) {
                return [...pre, { id_room: undefined, id_other: id }];
            }
            return pre;
        });
    };
    const css = `    display: flex;
            align-items: center;
            padding: 4px 6px;
           background-color: #5e5e5e;
            color: #cbcbcb;
            cursor: var(--pointer);
            border-radius: 5px;
            font-size: 1.3rem;
            font-weight: 400;
            justify-content: center;
              @media (min-width: 769px){
                padding: 6px;
              }
          `;
    const cssImage = `
                    min-width: 40px;
                    width: 40px;
                    height: 40px;
                    margin-right: 5px;
                    cursor: var(--pointer); 
                    @media (min-width: 769px){
                            width: 100%;
                            height: 170px;
                            margin-right: 0;
                            img{border-radius: 5px 5px 0 0 !important; }
                    }
                    img{border-radius: 50% ;}`;
    return (
        <>
            <DivResults id="friends" ref={eleRef}>
                {loading && (
                    <DivLoading>
                        <LoadingI />
                    </DivLoading>
                )}

                {data?.map((vl) => (
                    <Div
                        key={vl.id}
                        wrap="wrap"
                        css={`
                            width: 185px;
                            padding: 5px;
                            border: 1px solid #414141;
                            margin: 10px auto;
                            transition: all 0.2s linear;
                            position: relative;
                            &:hover {
                                box-shadow: 0 0 8px #6a48bc;
                            }
                            @media (min-width: 480px) {
                                width: 306px;
                                margin: 10px;
                            }
                            @media (min-width: 769px) {
                                width: 190px;
                                height: fit-content;
                                flex-wrap: wrap;
                                justify-content: center;
                                text-align: center;
                                background-color: #292a2c;
                                box-shadow: 0 0 5px #7b797987;
                                border-radius: 5px;
                                padding: 0 0 12px;
                            }
                        `}
                    >
                        <Div
                            css={`
                                position: absolute;
                                right: 9px;
                                font-size: 20px;
                            `}
                        >
                            <DotI />
                        </Div>
                        <TagProfle
                            button={[
                                {
                                    text: 'Messenger',
                                    css: css + ' background-color: #366ab3; ',
                                    onClick: () => handleMessenger(vl.id),
                                },
                            ]}
                            cssImage={cssImage}
                            data={vl}
                        />
                    </Div>
                ))}
            </DivResults>
        </>
    );
};
export default Friends;
