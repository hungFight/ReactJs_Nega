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
    };
    location?: string;
    Element?: ReactElement;
    css?: string;
    profile?: boolean;
}> = ({ data, location, Element, css, profile }) => {
    const dispatch = useDispatch();
    const handleHistory = async (res: { id: string; avatar: string; fullName: string; gender: number }) => {
        const result = await userAPI.setHistory(res);
        console.log('sss');
    };
    return (
        <>
            <Div
                key={data.id}
                onClick={(e) => {
                    e.stopPropagation();
                    if (profile) {
                        handleHistory(data);
                        dispatch(setOpenProfile({ newProfile: [data.id], currentId: '' }));
                    }
                }}
                css={`
                    width: 100%;
                    display: flex;
                    align-items: center;
                    position: relative;
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
                        width: 35px;
                        height: 35px;
                        align-items: inherit;
                        justify-content: center;
                        font-size: 25px;
                        border-radius: 50%;
                        overflow: hidden;
                    `}
                >
                    <Avatar src={data.avatar || ''} alt={data.fullName} gender={data.gender} />
                </Div>
                <Div css="padding:0 8px">
                    <Hname css="font-family: 'GentiumPlusItalic', sans-serif; width: fit-content; display: flex; align-items: center; font-size: 1.5rem; font-weight: 600;">
                        {data.fullName}
                    </Hname>
                </Div>
                {Element}
            </Div>
        </>
    );
};

export default memo(Account);
