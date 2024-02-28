import clsx from 'clsx';
import React, { memo, useState, useEffect, useLayoutEffect, useCallback, forwardRef, Ref } from 'react';

import { FaUserCircle } from 'react-icons/fa';
import Images from '../../assets/images';
import { Img } from '../styleComponents/styleDefault';
import { useDispatch, useSelector } from 'react-redux';
import { DivImg, DivImgS } from '../styleComponents/styleComponents';
import { InitialStateHideShow, onPersonalPage, onSetting, setOpenProfile } from '../../redux/hideShow';
import CommonUtils from '~/utils/CommonUtils';
import fileWorkerAPI from '~/restAPI/fileWorkerAPI';

interface _Avatar {
    className?: string;
    idH?: string;
    id?: string;
    src?: any;
    alt?: string | undefined;
    fallback?: any;
    width?: string;
    radius?: string;
    gender: number | undefined;
    onClick?: (args: any) => void;
    css?: string;
    profile?: string;
    onTouchMove?: (args: any) => void;
    children?: React.ReactElement;
    currentId?: string; // Is current profile's id
}

const Avatar = forwardRef((props: _Avatar, ref: any) => {
    const {
        className,
        idH,
        id,
        src,
        alt,
        width,
        radius,
        gender,
        onClick,
        onTouchMove,
        css,
        profile = '',
        children,
        currentId,
    } = props;
    const dispatch = useDispatch();
    const [avatar, setAvatar] = useState<boolean>(false);
    const [avatarFallback, setAvatarFallback] = useState<string>(
        src ? `${process.env.REACT_APP_SERVER_FILE_V1}files/getFile/${src}` : '',
    );
    // useEffect(() => {
    //     setAvatarFallback(!src ? Fallback : src);
    // }, [Fallback, src]);
    const [repetitions, setRepetitions] = useState<number>(0);
    const handleErrorImage = () => {
        console.log('err avatar');
        setAvatarFallback(
            gender === 0
                ? Images.defaultAvatarMale
                : gender === 1
                ? Images.defaultAvatarFemale
                : gender === 11
                ? Images.anonymousMale
                : gender === 12
                ? Images.anonymousFemale
                : Images.defaultAvataLgbt,
        );
        setRepetitions((pev) => pev + 1);
        if (repetitions >= 2) {
            setAvatar(true);
        } else {
            setAvatar(false);
        }
    };
    useEffect(() => {
        if (src && avatarFallback !== `${process.env.REACT_APP_SERVER_FILE_V1}files/getFile/${src}`)
            setAvatarFallback(`${process.env.REACT_APP_SERVER_FILE_V1}files/getFile/${src}`);
    }, [src]);
    const events = {
        onClick,
        onTouchMove,
    };

    const handleOpentProfile = () => {
        if (profile === 'po' && id) dispatch(setOpenProfile({ newProfile: [id], currentId: currentId }));
    };
    const TagH: any = profile === 'url' ? DivImg : DivImgS;
    console.log(avatarFallback, 'avatarFallback');

    return avatar ? (
        <FaUserCircle />
    ) : (
        <TagH
            to={
                profile === 'url'
                    ? `${
                          window.location.pathname.split('/')[1] ? window.location.pathname.split('/')[1] : 'social'
                      }/profile?id=${id}`
                    : ''
            }
            id={idH}
            width={width}
            css={css}
            {...events}
            ref={ref}
            className={className}
        >
            {children}
            <Img
                src={avatarFallback}
                alt={alt}
                onError={handleErrorImage}
                radius={radius}
                onClick={handleOpentProfile}
            />
        </TagH>
    );
});

export default memo(Avatar);
