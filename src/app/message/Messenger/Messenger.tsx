import { memo } from 'react';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import CryptoJS from 'crypto-js';
import 'swiper/css/effect-coverflow';

import { CloseI, SendI, UndoI, LoadingI } from '~/assets/Icons/Icons';
import Hovertitle from '~/reUsingComponents/HandleHover/HoverTitle';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
import useDebounce from '~/reUsingComponents/hook/useDebounce';
import { DivIconMs } from '../styleMessage';
import { DivResults, DivSend } from './styleSed';
import { Div, Input } from '~/reUsingComponents/styleComponents/styleDefault';
import { DivLoading, DivPos, Hname } from '~/reUsingComponents/styleComponents/styleComponents';
import ListAccounts from './ListAccounts';
import MoreOption from './MoreOption';
import LogicMessenger from './LogicMessenger';

const Send: React.FC<{
    colorText: string;
    colorBg: number;
    dataUser: { id: string; avatar: any; fullName: string; nickName: string; gender: number };
    userOline: string[];
    setId_chats: React.Dispatch<
        React.SetStateAction<
            {
                id_room: string | undefined;
                id_other: string;
            }[]
        >
    >;
    id_chats: {
        id_room: string | undefined;
        id_other: string;
    }[];
}> = ({ colorBg, colorText, dataUser, userOline, setId_chats, id_chats }) => {
    const {
        userId,
        rooms,
        searchUser,
        setSearchUser,
        send,
        loading,
        moreBar,
        setMoreBar,
        handleShowHide,
        handleSearch,
        dataMore,
        lg,
    } = LogicMessenger();
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
                    <p>+</p>
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
                        <Div
                            css="width: 40px; height: 100%; align-items: center; justify-content: center; font-size: 22px; "
                            onClick={handleShowHide}
                        >
                            <UndoI />
                        </Div>
                        <Input
                            type="text"
                            value={searchUser}
                            placeholder="Search"
                            onChange={handleSearch}
                            color={colorText}
                            border="0"
                            width="auto"
                            margin="0"
                        />
                        <DivPos width="35px" right="50px" onClick={() => setSearchUser('')}>
                            <CloseI />
                        </DivPos>
                        <Avatar
                            src={dataUser.avatar}
                            alt={dataUser.fullName}
                            gender={dataUser.gender}
                            radius="50%"
                            css="width: 35px; height: 35px;"
                        />
                    </Div>
                    <DivResults>
                        <Div css=".swiper{padding: 14px 2px;} .swiper-slide, swiper-slide{user-select: none;} .swiper-pagination{top: 70px !important; height: 1px !important;} padding: 5px 2px;">
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
                                            src="https://pbs.twimg.com/media/DefM3PPXcAABTmm.jpg"
                                            gender={0}
                                            radius="50%"
                                            css="min-width: 40px; width: 40px; height: 40px; margin: 3px 5px; "
                                        />
                                        <Hname>Nguyen Trong Hung</Hname>
                                    </Div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Div>
                                        <Avatar
                                            src="https://hips.hearstapps.com/hmg-prod/images/cutest-dog-breeds-64358b34b2905.jpeg?crop=0.891xw:0.357xh;0,0.137xh&resize=1200:*"
                                            gender={0}
                                            radius="50%"
                                            css="min-width: 40px; width: 40px; height: 40px; margin: 3px 5px; "
                                        />
                                        <Hname>Nguyen Hung</Hname>
                                    </Div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Div>
                                        <Avatar
                                            src="https://www.brightstarbuddies.com.au/blog/wp-content/uploads/sites/8/bonniechessiegirl4-2.jpg"
                                            gender={0}
                                            radius="50%"
                                            css="min-width: 40px; width: 40px; height: 40px; margin: 3px 5px; "
                                        />
                                        <Hname>Ngoc Linh</Hname>
                                    </Div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Div>
                                        <Avatar
                                            src="https://pbs.twimg.com/media/DefM3PPXcAABTmm.jpg"
                                            gender={0}
                                            radius="50%"
                                            css="min-width: 40px; width: 40px; height: 40px; margin: 3px 5px; "
                                        />
                                        <Hname>MNgoc Phuong</Hname>
                                    </Div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Div>
                                        <Avatar
                                            src="https://pbs.twimg.com/media/DefM3PPXcAABTmm.jpg"
                                            gender={0}
                                            radius="50%"
                                            css="min-width: 40px; width: 40px; height: 40px; margin: 3px 5px; "
                                        />
                                        <Hname>Hiseper</Hname>
                                    </Div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Div>
                                        <Avatar
                                            src="https://pbs.twimg.com/media/DefM3PPXcAABTmm.jpg"
                                            gender={0}
                                            radius="50%"
                                            css="min-width: 40px; width: 40px; height: 40px; margin: 3px 5px; "
                                        />
                                        <Hname>Hiseper</Hname>
                                    </Div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Div>
                                        <Avatar
                                            src="https://pbs.twimg.com/media/DefM3PPXcAABTmm.jpg"
                                            gender={0}
                                            radius="50%"
                                            css="min-width: 40px; width: 40px; height: 40px; margin: 3px 5px; "
                                        />
                                    </Div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Div>
                                        <Avatar
                                            src="https://pbs.twimg.com/media/DefM3PPXcAABTmm.jpg"
                                            gender={0}
                                            radius="50%"
                                            css="min-width: 40px; width: 40px; height: 40px; margin: 3px 5px; "
                                        />
                                    </Div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Div>
                                        <Avatar
                                            src="https://pbs.twimg.com/media/DefM3PPXcAABTmm.jpg"
                                            gender={0}
                                            radius="50%"
                                            css="min-width: 40px; width: 40px; height: 40px; margin: 3px 5px; "
                                        />
                                    </Div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Div>
                                        <Avatar
                                            src="https://pbs.twimg.com/media/DefM3PPXcAABTmm.jpg"
                                            gender={0}
                                            radius="50%"
                                            css="min-width: 40px; width: 40px; height: 40px; margin: 3px 5px; "
                                        />
                                    </Div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Div>
                                        <Avatar
                                            src="https://pbs.twimg.com/media/DefM3PPXcAABTmm.jpg"
                                            gender={0}
                                            radius="50%"
                                            css="min-width: 40px; width: 40px; height: 40px; margin: 3px 5px; "
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
                                    key={r._id + r.room.id}
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
                            <MoreOption dataMore={dataMore[lg]} colorText={colorText} setMoreBar={setMoreBar} />
                        )}
                    </DivResults>
                </DivSend>
            )}
        </>
    );
};

export default memo(Send);
