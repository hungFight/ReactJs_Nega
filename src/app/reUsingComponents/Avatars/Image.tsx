import React, { useEffect, useState } from 'react';
import { Img } from '../styleComponents/styleDefault';

const Image: React.FC<{ src: string; fullName: string; onClick: () => void }> = ({ src, fullName, onClick }) => {
    const [url, setUrl] = useState<string>(src ? `${process.env.REACT_APP_SERVER_FILE_V1}files/getFile/${src}` : '');
    useEffect(() => {
        if (src && url !== `${process.env.REACT_APP_SERVER_FILE_V1}files/getFile/${src}`)
            setUrl(`${process.env.REACT_APP_SERVER_FILE_V1}files/getFile/${src}`);
    }, [src]);
    return <Img src={url} alt={fullName} onClick={onClick} />;
};

export default Image;
