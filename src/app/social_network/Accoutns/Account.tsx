import React, { ReactElement, ReactHTMLElement, ReactNode, memo } from 'react';

import Avatar from '~/reUsingComponents/Avatars/Avatar';
import { useDispatch } from 'react-redux';
import { setOpenProfile } from '~/redux/hideShow';
import userAPI from '~/restAPI/userAPI';
import { Div } from '~/reUsingComponents/styleComponents/styleDefault';
import { Hname } from '~/reUsingComponents/styleComponents/styleComponents';

const Account: React.FC<{
    data: {
        id: string;
        avatar: string;
        fullName: string;
        gender: number;
    }[];
    location?: string;
    Element?: ReactElement;
    css?:string
}> = ({ data, location, Element,css }) => {
    const dispatch = useDispatch();
    const handleHistory = async (res: { id: string; avatar: string; fullName: string; gender: number }) => {
        const result = await userAPI.setHistory(res);
        console.log('sss');
    };
    return (
        <>
            {data.map((res) => (
                <Div
                    key={res.id}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleHistory(res);
                        dispatch(setOpenProfile({ newProfile: [res.id], currentId: '' }));
                    }}
                    css={`
                        width: 100%;
                        display: flex;
                        align-items: center;
                        padding: 8px 10px;
                        cursor: var(--pointer);
                        &:hover {
                            background-color: var(--background-hover);
                        }
                        ${css}
                    `}
                >
                    <Div
                        css={`
                            width: 40px;
                            height: 39.5px;
                            align-items: inherit;
                            justify-content: center;
                            font-size: 25px;
                            border-radius: 50%;
                            overflow: hidden;
                        `}
                    >
                        <Avatar src={res.avatar || ''} alt={res.fullName} gender={res.gender} />
                    </Div>
                    <Div css="padding:0 8px">
                        <Hname css="font-family: 'GentiumPlusItalic', sans-serif; width: fit-content; display: flex; align-items: center; font-size: 16px; font-weight: 100;">
                            {res.fullName}
                        </Hname>
                    </Div>
                    {Element}
                </Div>
            ))}
        </>
    );
};

export default memo(Account);
