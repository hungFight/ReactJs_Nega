import Notification from './Notification/Notification';

import './message.scss';
import Send from './Messenger/Messenger';
import { DivMs } from './styleMessage';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { PropsBgRD } from '~/redux/background';
import { PropsUser } from '~/typescript/userType';
import { PropsId_chats } from 'src/App';

const Message: React.FC<{
    dataUser: PropsUser;
    userOnline: string[];
    setId_chats: React.Dispatch<React.SetStateAction<PropsId_chats[]>>;
    id_chats: PropsId_chats[];
}> = ({ dataUser, userOnline, setId_chats, id_chats }) => {
    const [width, setWidth] = useState<string>('');
    const { colorText, colorBg } = useSelector((state: PropsBgRD) => state.persistedReducer.background);
    const elRef = useRef<any>();
    const xRef = useRef<number | null>(null);
    const yRef = useRef<number | null>(null);

    const handleTouchMove = (e: any) => {
        e.stopPropagation();
        const touch = e.touches[0];
        const x = touch.clientX;
        const y = touch.clientY;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const elementRect = elRef.current.getBoundingClientRect();
        console.log(x, y, viewportWidth, viewportHeight, elementRect);
        if (elRef.current) {
            if (viewportWidth - 20 >= x && x >= 15) {
                xRef.current = x - 20;
                elRef.current.style.left = `${x - 20}px`;
            }
            if (viewportHeight - 10 >= y && y >= 24) {
                yRef.current = y - 20;
                elRef.current.style.top = `${y - 40}px`;
            }
        }
        // Đặt vị trí cho phần tử
    };
    window.addEventListener('onload', reloadMs);
    function reloadMs() {
        console.log('not', width);
        setWidth(window.location.pathname);
    }
    return (
        <DivMs width="50px" top="60px" ref={elRef} onTouchMove={handleTouchMove}>
            <Notification dataUser={dataUser} userOline={userOnline} colorText={colorText} colorBg={colorBg} />
            <Send dataUser={dataUser} userOline={userOnline} colorText={colorText} colorBg={colorBg} setId_chats={setId_chats} id_chats={id_chats} />
        </DivMs>
    );
};

export default Message;
