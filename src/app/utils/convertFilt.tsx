export const convertFIle = (id?: string | null, type?: 'video' | 'image') => {
    if (id) return type !== 'video' ? process.env.REACT_APP_SERVER_FILE_GET_IMG_V1 + '/' + id : process.env.REACT_APP_SERVER_FILE_GET_VIDEO_V1 + '/' + id;
    return '';
};
