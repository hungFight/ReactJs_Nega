import React, { useEffect, useState } from 'react';
import { Img } from '../styleComponents/styleDefault';

const Image: React.FC<{ src: string; fullName: string; onClick?: () => void; radius?: string }> = ({
    src,
    radius,
    fullName,
    onClick,
}) => {
    const [url, setUrl] = useState<string>(src ? `${process.env.REACT_APP_SERVER_FILE_V1}/getFile/${src}` : '');
    useEffect(() => {
        if (src && url !== `${process.env.REACT_APP_SERVER_FILE_V1}/getFile/${src}`)
            setUrl(`${process.env.REACT_APP_SERVER_FILE_V1}/getFile/${src}`);
    }, [src]);
    return <Img src={url} alt={fullName} onClick={onClick} radius={radius} />;
};

export default Image;
