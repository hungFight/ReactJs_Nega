export const convertFIle = (id?: string, type?: 'video' | 'image') => {
    return type !== 'video' ? process.env.REACT_APP_SERVER_FILE_GET_IMG_V1 + '/' + id : process.env.REACT_APP_SERVER_FILE_GET_VIDEO_V1 + '/' + id;
};
