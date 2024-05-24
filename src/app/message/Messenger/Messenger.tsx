import { memo } from 'react';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import 'swiper/css/effect-coverflow';

import { CloseI, SendI, UndoI, LoadingI } from '~/assets/Icons/Icons';
import Hovertitle from '~/reUsingComponents/HandleHover/HoverTitle';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
import { DivIconMs } from '../styleMessage';
import { DivResults, DivSend } from './styleSed';
import { Div, Input } from '~/reUsingComponents/styleComponents/styleDefault';
import { DivLoading, DivFlexPosition, Hname } from '~/reUsingComponents/styleComponents/styleComponents';
import ListAccounts from './ListAccounts';
import MoreOption from './MoreOption';
import LogicMessenger from './LogicMessenger';
import { PropsId_chats } from 'src/App';
import { PropsUser } from '~/typescript/userType';

const Send: React.FC<{
    colorText: string;
    colorBg: number;
    dataUser: PropsUser;
    userOline: string[];
    setId_chats: React.Dispatch<React.SetStateAction<PropsId_chats[]>>;
    id_chats: PropsId_chats[];
}> = ({ colorBg, colorText, dataUser, userOline, setId_chats, id_chats }) => {
    const { userId, rooms, searchUser, setSearchUser, send, loading, moreBar, setMoreBar, handleShowHide, handleSearch, dataMore, lg } = LogicMessenger(dataUser);
    const itemLg: { [en: string]: { seenBy: string; who: string }; vi: { seenBy: string; who: string } } = {
        en: {
            seenBy: 'saw',
            who: 'You',
        },
        vi: {
            seenBy: 'đã xem',
            who: 'Bạn',
        },
    };
    return (
        <>
            {!send && (
                <Hovertitle Tags={DivIconMs} title="Send" size="23px" color={colorText} onClick={handleShowHide}>
                    <SendI />
                </Hovertitle>
            )}
            {send && (
                <DivSend onTouchMove={(e) => e.stopPropagation()}>
                    <Div
                        width="100%"
                        css={`
                            height: 40px;
                            align-items: center;
                            justify-content: space-evenly;
                            position: relative;
                            color: ${colorText};
                        `}
                    >
                        <Div css="width: 40px; height: 100%; align-items: center; justify-content: center; font-size: 30px; @media(min-width: 500px){font-size: 25px} " onClick={handleShowHide}>
                            <UndoI />
                        </Div>
                        <Input type="text" value={searchUser} placeholder="Search" onChange={handleSearch} color={colorText} border="0" width="73%" margin="0" />
                        <DivFlexPosition width="35px" size="22px" right="100px" onClick={() => setSearchUser('')}>
                            <CloseI />
                        </DivFlexPosition>
                        <Avatar src={dataUser.avatar} alt={dataUser.fullName} gender={dataUser.gender} radius="50%" css="width: 35px; height: 35px;" />
                    </Div>
                    <DivResults>
                        <Div css=".swiper{padding: 14px 2px;} .swiper-slide, swiper-slide{user-select: none;} .swiper-pagination{top: 74px !important; height: 1px !important;} padding: 5px 2px;">
                            <Swiper
                                slidesPerView={6}
                                spaceBetween={10}
                                pagination={{
                                    type: 'progressbar',
                                }}
                                modules={[Pagination]}
                                className="mySwiper"
                            >
                                <SwiperSlide>
                                    <Div>
                                        <Avatar
                                            src="f6b60c5a-b56c-4e00-aec6-99d88e9398b4"
                                            gender={0}
                                            radius="50%"
                                            css="min-width: 50px; width: 50px; height: 50px; margin: 3px 5px; @media(min-width: 500px){min-width: 45px ;width: 45px; height: 45px; }"
                                        />
                                        <Hname>Nguyen Trong Hung</Hname>
                                    </Div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Div>
                                        <Avatar
                                            src="f6b60c5a-b56c-4e00-aec6-99d88e9398b4"
                                            gender={0}
                                            radius="50%"
                                            css="min-width: 50px; width: 50px; height: 50px; margin: 3px 5px; @media(min-width: 500px){min-width: 45px ;width: 45px; height: 45px; }"
                                        />
                                        <Hname>Nguyen Hung</Hname>
                                    </Div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Div>
                                        <Avatar
                                            src="f6b60c5a-b56c-4e00-aec6-99d88e9398b4"
                                            gender={0}
                                            radius="50%"
                                            css="min-width: 50px; width: 50px; height: 50px; margin: 3px 5px; @media(min-width: 500px){min-width: 45px ;width: 45px; height: 45px; }"
                                        />
                                        <Hname>Ngoc Linh</Hname>
                                    </Div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Div>
                                        <Avatar
                                            src="f6b60c5a-b56c-4e00-aec6-99d88e9398b4"
                                            gender={0}
                                            radius="50%"
                                            css="min-width: 50px; width: 50px; height: 50px; margin: 3px 5px; @media(min-width: 500px){min-width: 45px ;width: 45px; height: 45px; }"
                                        />
                                        <Hname>MNgoc Phuong</Hname>
                                    </Div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Div>
                                        <Avatar
                                            src="f6b60c5a-b56c-4e00-aec6-99d88e9398b4"
                                            gender={0}
                                            radius="50%"
                                            css="min-width: 50px; width: 50px; height: 50px; margin: 3px 5px; @media(min-width: 500px){min-width: 45px ;width: 45px; height: 45px; }"
                                        />
                                        <Hname>Hiseper</Hname>
                                    </Div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Div>
                                        <Avatar
                                            src="f6b60c5a-b56c-4e00-aec6-99d88e9398b4"
                                            gender={0}
                                            radius="50%"
                                            css="min-width: 50px; width: 50px; height: 50px; margin: 3px 5px; @media(min-width: 500px){min-width: 45px ;width: 45px; height: 45px; }"
                                        />
                                        <Hname>Hiseper</Hname>
                                    </Div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Div>
                                        <Avatar
                                            src="f6b60c5a-b56c-4e00-aec6-99d88e9398b4"
                                            gender={0}
                                            radius="50%"
                                            css="min-width: 50px; width: 50px; height: 50px; margin: 3px 5px; @media(min-width: 500px){min-width: 45px ;width: 45px; height: 45px; }"
                                        />
                                    </Div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Div>
                                        <Avatar
                                            src="f6b60c5a-b56c-4e00-aec6-99d88e9398b4"
                                            gender={0}
                                            radius="50%"
                                            css="min-width: 50px; width: 50px; height: 50px; margin: 3px 5px; @media(min-width: 500px){min-width: 45px ;width: 45px; height: 45px; }"
                                        />
                                    </Div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Div>
                                        <Avatar
                                            src="f6b60c5a-b56c-4e00-aec6-99d88e9398b4"
                                            gender={0}
                                            radius="50%"
                                            css="min-width: 50px; width: 50px; height: 50px; margin: 3px 5px; @media(min-width: 500px){min-width: 45px ;width: 45px; height: 45px; }"
                                        />
                                    </Div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Div>
                                        <Avatar
                                            src="f6b60c5a-b56c-4e00-aec6-99d88e9398b4"
                                            gender={0}
                                            radius="50%"
                                            css="min-width: 50px; width: 50px; height: 50px; margin: 3px 5px; @media(min-width: 500px){min-width: 45px ;width: 45px; height: 45px; }"
                                        />
                                    </Div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Div>
                                        <Avatar
                                            src="f6b60c5a-b56c-4e00-aec6-99d88e9398b4"
                                            gender={0}
                                            radius="50%"
                                            css="min-width: 50px; width: 50px; height: 50px; margin: 3px 5px; @media(min-width: 500px){min-width: 45px ;width: 45px; height: 45px; }"
                                        />
                                    </Div>
                                </SwiperSlide>
                            </Swiper>
                        </Div>
                        {loading ? (
                            <DivLoading>
                                <LoadingI />
                            </DivLoading>
                        ) : (
                            rooms.map((r) => (
                                <ListAccounts
                                    key={r._id}
                                    data={r}
                                    itemLg={itemLg[lg]}
                                    userId={userId}
                                    colorText={colorText}
                                    colorBg={colorBg}
                                    setMoreBar={setMoreBar}
                                    setId_chats={setId_chats}
                                    id_chats={id_chats}
                                />
                            ))
                        )}
                        {moreBar.id && (
                            <MoreOption dataMore={dataMore[lg]} colorText={colorText} setMoreBar={setMoreBar} background={rooms.find((r) => r._id === moreBar.conversationId)?.background} />
                        )}
                    </DivResults>
                </DivSend>
            )}
        </>
    );
};

export default memo(Send);
