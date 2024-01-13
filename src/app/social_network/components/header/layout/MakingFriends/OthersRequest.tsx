import { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { DotI, LoadingI } from '~/assets/Icons/Icons';
import { Div, H3 } from '~/reUsingComponents/styleComponents/styleDefault';
import peopleAPI from '~/restAPI/socialNetwork/peopleAPI';
import CommonUtils from '~/utils/CommonUtils';
import TagProfle from './TagProfile';
import { useDispatch, useSelector } from 'react-redux';
import Requested from './Requested';
import { DivLoading } from '~/reUsingComponents/styleComponents/styleComponents';
import { DivResults } from './styleMakingFriends';
import ServerBusy from '~/utils/ServerBusy';

interface PropsOthers {
    avatar: any;
    birthday: string;
    fullName: string;
    gender: number;
    id: string;
    nickName: string | undefined;
}
const Others: React.FC<{ type: string }> = ({ type }) => {
    const dispatch = useDispatch();
    const reload = useSelector((state: { reload: { people: number } }) => state.reload.people);
    const [data, setData] = useState<PropsOthers[]>();

    const [loading, setLoading] = useState<boolean>(false);
    const limit: number = 1;

    const offsetRef = useRef<number>(0);
    const cRef = useRef<number>(0);
    const eleRef = useRef<any>();
    const dataRef = useRef<any>([]);

    async function fetch(rel: boolean) {
        cRef.current = 1;
        if (rel) {
            offsetRef.current = 0;
            dataRef.current = [];
            setLoading(true);
        }

        const res = await peopleAPI.getFriends(offsetRef.current, limit, 'others');
        const data = ServerBusy(res, dispatch);

        console.log(type, res);
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
        if (type === 'otherssent' || cRef.current === 0) fetch(true);
        eleRef.current.addEventListener('scroll', handleScroll);
        return () => {
            eleRef?.current?.removeEventListener('scroll', handleScroll);
        };
    }, [reload]);
    const handleConfirm = async (id: string, kindOf: string = 'friends') => {
        const res = await peopleAPI.setConfirm(id, kindOf);
        const dataR = ServerBusy(res, dispatch);

        console.log('confirm', kindOf, id, res);
        refresh(dataR);
        function refresh(res: any) {
            if (res.ok === 1) {
                const newData = data?.filter((x: PropsOthers) => {
                    return x.id !== res.id_fr;
                });
                console.log('newData', newData);
                setData(newData);
            }
        }
    };
    const handleRemove = async (id: string, kindOf?: string) => {
        console.log('deleted', id);
        const res = await peopleAPI.delete(id, kindOf);
        const dataR = ServerBusy(res, dispatch);
        if (dataR) {
            const newData: any = data?.filter((d: { id: string }) => d.id !== id);
            console.log('delete', dataR);
            setData(newData);
        }
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
            <DivResults id="otherssent" ref={eleRef}>
                {loading && (
                    <DivLoading>
                        <LoadingI />
                    </DivLoading>
                )}

                {data?.map((vl) => {
                    const buttons = [
                        {
                            text: 'Delete',
                            css: css,
                            onClick: () => handleRemove(vl.id, 'friends'),
                        },
                        {
                            text: 'Confirm',
                            css: css + 'background-color:   #1553a1; ',
                            onClick: () => handleConfirm(vl.id),
                        },
                    ];
                    return (
                        <Div
                            key={vl.id}
                            wrap="wrap"
                            css={`
                                width: 185px;
                                padding: 5px;
                                border: 1px solid #414141;
                                margin: 10px;
                                transition: all 0.2s linear;
                                position: relative;
                                &:hover {
                                    box-shadow: 0 0 8px #6a48bc;
                                }
                                @media (min-width: 480px) {
                                    width: 306px;
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
                            <TagProfle button={buttons} cssImage={cssImage} data={vl} />
                        </Div>
                    );
                })}
            </DivResults>
        </>
    );
};
export default Others;
