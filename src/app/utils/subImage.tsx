import Images from '~/assets/images';

const subImage = (id: string | undefined | null, gender: number | string | undefined) => {
    if (id) return id;
    else {
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
