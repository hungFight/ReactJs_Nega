import CryptoJS from 'crypto-js';
import React from 'react';

export const encrypt = (t: string, key: string) => {
    return CryptoJS.AES.encrypt(t, key).toString();
};

export const decrypt = (t: string, key: string) => {
    const bytes = CryptoJS.AES.decrypt(t, key);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
};
