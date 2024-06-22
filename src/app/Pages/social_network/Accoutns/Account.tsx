import React, { ReactElement, memo } from 'react';

import Avatar from '~/reUsingComponents/Avatars/Avatar';
import { useDispatch } from 'react-redux';
import { Div, Links, Smooth } from '~/reUsingComponents/styleComponents/styleDefault';
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
    profile?: string;
    onClick?: (v: any) => void;
}> = ({ data, location, Element, css, profile, onClick }) => {
    const dispatch = useDispatch();
    const handleHistory = async (res: { id: string; avatar: string; fullName: string; gender: number }) => {
        // const result = await userAPI.setHistory(res);
        console.log('sss');
    };
    const TagH: any = profile === 'url' ? Smooth : Div;
    return (
        <>
            <TagH
                to={profile === 'url' ? `${window.location.pathname.split('/')[1] ? window.location.pathname.split('/')[1] : 'social'}/profile?id=${data.id}` : ''}
                key={data.id}
                onClick={onClick}
                css={`
                    width: 100% !important;
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
                        width: 40px;
                        height: 40px;
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
                    <Hname css="font-family: 'GentiumPlusItalic', sans-serif; width: fit-content; display: flex; align-items: center; font-size: 1.5rem; font-weight: 600;">{data.fullName}</Hname>
                </Div>
                {Element}
            </TagH>
        </>
    );
};

export default memo(Account);
