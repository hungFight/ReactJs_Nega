import React, { useEffect, useState } from 'react';
import { Img } from '../styleComponents/styleDefault';

const Image: React.FC<{ src: string; fullName: string; onClick?: () => void; radius?: string }> = ({
    src,
    radius,
    fullName,
    onClick,
}) => {
    const [url, setUrl] = useState<string>(src ? `${process.env.REACT_APP_SERVER_FILE_GET_IMG_V1}/${src}` : '');
    useEffect(() => {
        if (src && url !== `${process.env.REACT_APP_SERVER_FILE_GET_IMG_V1}/${src}`)
            setUrl(`${process.env.REACT_APP_SERVER_FILE_GET_IMG_V1}/${src}`);
    }, [src]);
    return <Img src={url} alt={fullName} onClick={onClick} radius={radius} />;
};

export default Image;
