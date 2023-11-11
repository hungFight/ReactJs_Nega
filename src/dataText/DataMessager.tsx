export type PropsOptionText = {
    personal: string;
    background: string;
    balloon: string;
    move: string;
    del: string;
    undo: string;
};
export type PropsPhraseText = {
    dateTime: {
        remove: string;
        replace: string;
    };
    input: {
        write: string;
    };
};
export type PropsConversionText = {
    optionRoom: PropsOptionText;
    phrase: PropsPhraseText;
};
export const ConversationText: {
    [en: string]: PropsConversionText;
    vi: PropsConversionText;
} = {
    en: {
        optionRoom: {
            personal: 'View Profile',
            background: 'Background',
            balloon: 'Balloon',
            move: 'Move',
            del: 'Delete',
            undo: 'Undo',
        },
        phrase: {
            dateTime: {
                remove: 'Removed on',
                replace: 'Replaced on',
            },
            input: {
                write: 'is writing',
            },
        },
    },
    vi: {
        optionRoom: {
            personal: 'Trang cá nhân',
            background: 'Nền chat',
            balloon: 'Bong bóng chat',
            move: 'Di chuyển',
            del: 'Xoá',
            undo: 'Hoàn tác',
        },
        phrase: {
            dateTime: {
                remove: 'Đã loại bỏ vào',
                replace: 'Đã thay đổi vào',
            },
            input: {
                write: 'đang soạn',
            },
        },
    },
};
