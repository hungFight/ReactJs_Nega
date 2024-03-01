import React from 'react';
import Images from '~/assets/images';

const subImage = (id: string | undefined, gender: number | undefined) => {
    if (id) {
        const src = `${process.env.REACT_APP_SERVER_FILE_V1}/getFile/${id}`;
        return src;
    } else {
        return gender === 0
            ? Images.defaultAvatarMale
            : gender === 1
            ? Images.defaultAvatarFemale
            : gender === 11
            ? Images.anonymousMale
            : gender === 12
            ? Images.anonymousFemale
            : Images.defaultAvataLgbt;
    }
};

export default subImage;
