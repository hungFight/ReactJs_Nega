import clsx from 'clsx';
import React, { memo, useState, useEffect, useLayoutEffect, useCallback, forwardRef, Ref } from 'react';

import { FaUserCircle } from 'react-icons/fa';
import Images from '../../assets/images';
import { Img } from '../styleComponents/styleDefault';
import { useDispatch, useSelector } from 'react-redux';
import { DivImg } from '../styleComponents/styleComponents';
import { InitialStateHideShow, onPersonalPage, onSetting, setOpenProfile } from '../../redux/hideShow';
import CommonUtils from '~/utils/CommonUtils';

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
    profile?: boolean;
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
        fallback: Fallback = gender === 0
            ? Images.defaultAvatarMale
            : gender === 1
            ? Images.defaultAvatarFemale
            : gender === 11
            ? Images.anonymousMale
            : gender === 12
            ? Images.anonymousFemale
            : Images.defaultAvataLgbt,
        onClick,
        onTouchMove,
        css,
        profile = false,
        children,
        currentId,
    } = props;
    const dispatch = useDispatch();
    const [avatar, setAvatar] = useState<boolean>(false);
    const [avatarFallback, setAvatarFallback] = useState<string>('');
    // useEffect(() => {
    //     setAvatarFallback(!src ? Fallback : src);
    // }, [Fallback, src]);
    const [repetitions, setRepetitions] = useState<number>(0);
    const handleErrorImage = () => {
        console.log('err avatar');

        setAvatarFallback(Fallback);
        setRepetitions((pev) => pev + 1);
        if (repetitions >= 2) {
            setAvatar(true);
        } else {
            setAvatar(false);
        }
    };
    const events = {
        onClick,
        onTouchMove,
    };

    const handleOpentProfile = () => {
        if (profile && id) dispatch(setOpenProfile({ newProfile: [id], currentId: currentId }));
    };

    return avatar ? (
        <FaUserCircle />
    ) : (
        <DivImg id={idH} width={width} css={css} {...events} ref={ref} className={className}>
            {children}
            <Img
                src={src || Fallback || avatarFallback}
                alt={alt}
                onError={handleErrorImage}
                radius={radius}
                onClick={handleOpentProfile}
            />
        </DivImg>
    );
});

export default memo(Avatar);
