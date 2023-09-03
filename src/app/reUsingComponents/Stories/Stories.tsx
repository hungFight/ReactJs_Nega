import React, { useEffect, useRef, useState } from 'react';
import { Div } from '../styleComponents/styleDefault';
import { Video } from '../Videos/styleVideos';

const Stories: React.FC<{ src?: string; step?: number; height?: string }> = ({ src, step, height }) => {
    const video = useRef<HTMLVideoElement | null>(null);
    const progress = useRef<any>();
    const [showTime, setShowTime] = useState<number>(0);

    return (
        <Div>
            <Video src="https://www.youtube.com/watch?v=shLUsd7kQCI&list=RDshLUsd7kQCI&start_radio=1" ref={video} />
        </Div>
    );
};

export default Stories;
