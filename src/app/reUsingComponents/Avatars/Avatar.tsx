import React, { memo, useState, useEffect, forwardRef } from 'react';

import { FaUserCircle } from 'react-icons/fa';
import { Div, Img } from '../styleComponents/styleDefault';
import { useDispatch } from 'react-redux';
import { DivImgLink, DivImgS } from '../styleComponents/styleComponents';
import { setOpenProfile } from '../../redux/hideShow';
import subImage from '~/utils/subImage';
import { convertFIle } from '~/utils/convertFilt';

interface _Avatar {
    className?: string;
    idH?: string;
    id?: string;
    src?: any;
    alt?: string | undefined;
    fallback?: any;
    staticI?: boolean;
    width?: string;
    radius?: string;
    gender: number | string | undefined;
    onClick?: (args: any) => void;
    css?: string;
    profile?: 'url' | 'po';
    onTouchMove?: (args: any) => void;
    children?: React.ReactElement;
    currentId?: string; // Is current profile's id
}

const Avatar = forwardRef((props: _Avatar, ref: any) => {
    const { className, idH, id, src, alt, width, radius, staticI, gender, onClick, onTouchMove, css, profile = '', children, currentId } = props;

    const dispatch = useDispatch();
    const [avatar, setAvatar] = useState<boolean>(false);
    const [avatarFallback, setAvatarFallback] = useState<string>(() => subImage(convertFIle(src), gender));
    // useEffect(() => {
    //     setAvatarFallback(!src ? Fallback : src);
    // }, [Fallback, src]);
    console.log(gender, alt, 'avatarFallback', src);
    const [repetitions, setRepetitions] = useState<number>(0);
    const handleErrorImage = (e: any) => {
        e.target.src = subImage('', gender);
        setRepetitions((pev) => pev + 1);
        if (repetitions >= 2) {
            setAvatar(true);
        } else {
            setAvatar(false);
        }
    };
    useEffect(() => {
        if (staticI) {
            setAvatarFallback(subImage('', gender));
        } else {
            if (src && avatarFallback !== convertFIle(src)) setAvatarFallback(convertFIle(src));
            if (src === 'delete' && avatarFallback) setAvatarFallback('');
        }
    }, [src]);
    const events = {
        onClick,
        onTouchMove,
    };

    const handleOpentProfile = () => {
        if (profile === 'po' && id) dispatch(setOpenProfile({ newProfile: [id], currentId: currentId }));
    };
    const TagH: any = profile === 'url' ? DivImgLink : DivImgS;

    return avatar ? (
        <FaUserCircle />
    ) : (
        <TagH
            to={profile === 'url' ? `${window.location.pathname.split('/')[1] ? window.location.pathname.split('/')[1] : 'social'}/profile?id=${id}` : ''}
            id={idH}
            width={width}
            css={css}
            {...events}
            ref={ref}
            className={className}
        >
            {children}
            <Img src={avatarFallback} alt={alt} onError={handleErrorImage} radius={radius} onClick={handleOpentProfile} />
        </TagH>
    );
});

export default memo(Avatar);
