export const convertFIle = (id?: string) => {
    return process.env.REACT_APP_SERVER_FILE_GET_IMG_V1 + '/' + id;
};
