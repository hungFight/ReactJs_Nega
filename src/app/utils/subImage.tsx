import React from 'react';
import Images from '~/assets/images';

const subImage = (id: string | undefined, gender: number | string | undefined) => {
    if (id) {
        const src = `${process.env.REACT_APP_SERVER_FILE_GET_IMG_V1}/${id}`;
        return src;
    } else {
        if (typeof gender === 'string') {
            return gender === 'male'
                ? Images.defaultAvatarMale
                : gender === 'female'
                ? Images.defaultAvatarFemale
                : gender === 'anonymousMale'
                ? Images.anonymousMale
                : gender === 'anonymousFemale'
                ? Images.anonymousFemale
                : Images.defaultAvataLgbt;
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
    }
};

export default subImage;
