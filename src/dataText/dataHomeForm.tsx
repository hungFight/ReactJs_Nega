import { ItalicI, StraightI } from '~/assets/Icons/Icons';

export const fontDatas: {
    name: string;
    url: string;
    type: { name: string; url?: string; icon: React.ReactNode; id: number }[];
    id: number;
}[] = [
    {
        name: 'Robotol',
        type: [
            { name: 'Straight', icon: <StraightI />, id: 1 },
            { name: 'Italics', icon: <ItalicI />, id: 2 },
        ],
        id: 1,
        url: '../assets/font-texts/Roboto-Light.ttf',
    },

    {
        name: 'Raleway',
        type: [{ name: 'Straight', icon: <StraightI />, id: 1 }],
        id: 2,
        url: '../assets/font-texts/Raleway-Regular.ttf',
    },
    { name: 'Arima', type: [{ name: 'Straight', icon: <StraightI />, id: 1 }], id: 3, url: '' },
    {
        name: 'Saira',
        type: [{ name: 'Straight', icon: <StraightI />, id: 1 }],
        id: 4,
        url: '../assets/font-texts/Saira-VariableFont_wdth,wght.ttf',
    },
    {
        name: 'Noto Sans',
        type: [
            { name: 'Straight', icon: <StraightI />, id: 1 },
            { name: 'Italics', icon: <ItalicI />, id: 2 },
        ],
        id: 5,
        url: '../assets/font-texts/NotoSans-Light.ttf',
    },
    { name: 'Item', type: [{ name: 'Straight', icon: <StraightI />, id: 1 }], id: 6, url: '' },
];
