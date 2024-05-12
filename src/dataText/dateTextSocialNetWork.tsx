import { LanguageI } from '~/assets/Icons/Icons';
import { InNetWork } from '~/social_network';

export const socialnetwork: { vi: InNetWork; en: InNetWork } = {
    vi: {
        header: {
            logo: 'Trang Chính',
            sett: 'Cài Đặt',

            home: {
                title: 'Trang Chủ',
                children: {
                    userBar: {
                        contentFirst: 'Chào mừng bạn quay lại!',
                        contentTwo: '',
                    },
                    form: {
                        textarea: 'Bạn đang nghĩ gì?',
                        buttonOne: 'Huỷ bỏ',
                        buttonTwo: 'Tiếp tục',
                        emoji: 'vi',
                        preView: {
                            time: {
                                hour: 'giờ',
                                minute: 'phút',
                                second: 'giây',
                            },
                            buttonFirst: 'Huỷ bỏ',
                            buttonTwo: 'Đăng bài',
                        },
                    },
                },
            },
            exchange: ' Giao Lưu',
            video: 'Gọi Video',
            search: {
                title: 'Tìm kiếm',
                children: {
                    rec: 'Vừa qua',
                    menu: [
                        {
                            id: 1,
                            title: 'Tìm kiếm',
                            children: [{ name: 'Địa chỉ', id: 1 }],
                        },
                        {
                            id: 2,
                            title: 'Loại',
                            children: [
                                { name: 'Người dùng', id: 1 },
                                { name: 'Bài đăng', id: 2 },
                                { name: 'Exchanges', id: 3 },
                            ],
                        },
                    ],
                },
            },
            friends: {
                title: 'Bạn bè',
                children: {
                    menu: [
                        {
                            name: 'Chưa kết bạn',
                            id: 'strangers',
                            bgAnimation: ['linear-gradient(90deg, transparent, #fcfcfc4d, #6bff81)', 'linear-gradient(270deg, transparent, #fbfbfb4d, #c05353);'],
                        },
                        { name: 'Đã kêt bạn', id: 'friends', bgAnimation: ['linear-gradient(270deg, transparent, #fcfcfc4d, #5af0df);', 'linear-gradient(90deg, transparent, #fcfcfc4d, #d267e0);'] },
                        { name: 'Gia đình', id: 'family', bgAnimation: ['linear-gradient(270deg, transparent, #fcfcfc4d, #def05a);', 'linear-gradient(90deg, transparent, #fcfcfc4d, #ff2d4e);'] },
                        { name: 'Bạn đã gửi', id: 'yousent', bgAnimation: ['linear-gradient(270deg, transparent, #fcfcfc4d, #4b80e8);', 'linear-gradient(90deg, transparent, #fcfcfc4d, #da6b3a);'] },
                        {
                            name: 'Người khác gửi',
                            id: 'otherssent',
                            bgAnimation: ['linear-gradient(270deg, transparent, #fcfcfc4d, #4be2e8);', 'linear-gradient(90deg, transparent, #fcfcfc4d, #408eff);'],
                        },
                    ],
                },
            },
            location: 'SN',
        },
        sett: {
            data: {
                data: [
                    {
                        title: 'Ngôn Ngữ',
                        icon: <LanguageI />,
                        children: {
                            data: [
                                { name: 'English', lg: 'en' },
                                { name: 'VietNamese', lg: 'vi' },
                            ],
                        },
                    },
                    {
                        title: 'Đăng Xuất',
                        logout: true,
                    },
                ],
            },
        },
        body: {},
    },
    en: {
        header: {
            logo: 'Spaceship',
            sett: 'Setting',

            home: {
                title: 'Home',
                children: {
                    userBar: {
                        contentFirst: 'Welcome back!',
                        contentTwo: 'We are always by your side',
                    },
                    form: {
                        textarea: "What's on your mind?",
                        buttonOne: 'Abolish',
                        buttonTwo: 'Continue',
                        emoji: 'en',
                        preView: {
                            time: {
                                hour: 'h',
                                minute: 'm',
                                second: 's',
                            },
                            buttonFirst: 'Abolish',
                            buttonTwo: 'Post',
                        },
                    },
                },
            },
            exchange: 'Exchange',
            video: 'Call Video',
            search: {
                title: 'Search',
                children: {
                    rec: 'Recently',
                    menu: [
                        {
                            id: 1,
                            title: 'Search-more',
                            children: [{ name: 'Address', id: 1 }],
                        },
                        {
                            id: 2,
                            title: 'Choose',
                            children: [
                                { name: 'Users', id: 1 },
                                { name: 'Posts', id: 2 },
                                { name: 'Exchanges', id: 3 },
                            ],
                        },
                    ],
                },
            },
            friends: {
                title: 'Friends',
                children: {
                    menu: [
                        { name: 'Not Friends', id: 'strangers', bgAnimation: ['linear-gradient(90deg, transparent, #fcfcfc4d, #6bff81)', 'linear-gradient(270deg, transparent, #fbfbfb4d, #c05353);'] },
                        { name: 'Friends', id: 'friends', bgAnimation: ['linear-gradient(270deg, transparent, #fcfcfc4d, #5af0df);', 'linear-gradient(90deg, transparent, #fcfcfc4d, #d267e0);'] },
                        { name: 'Family', id: 'family', bgAnimation: ['linear-gradient(270deg, transparent, #fcfcfc4d, #def05a);', 'linear-gradient(90deg, transparent, #fcfcfc4d, #ff2d4e);'] },
                        { name: 'You sent', id: 'yousent', bgAnimation: ['linear-gradient(270deg, transparent, #fcfcfc4d, #4b80e8);', 'linear-gradient(90deg, transparent, #fcfcfc4d, #da6b3a);'] },
                        {
                            name: 'others sent',
                            id: 'otherssent',
                            bgAnimation: ['linear-gradient(270deg, transparent, #fcfcfc4d, #4be2e8);', 'linear-gradient(90deg, transparent, #fcfcfc4d, #408eff);'],
                        },
                    ],
                },
            },
            location: 'SN',
        },
        sett: {
            data: {
                data: [
                    {
                        title: 'Language',
                        icon: <LanguageI />,
                        children: {
                            data: [
                                { name: 'English', lg: 'en' },
                                { name: 'VietNamese', lg: 'vi' },
                            ],
                        },
                    },
                    {
                        title: 'Log Out',
                        logout: true,
                    },
                ],
            },
        },
        body: {},
    },
};
