import CryptoJS from 'crypto-js';

const KEY = 'QVVUT19BVFRFTkRBTkNFX1JFQ09SREVS';

export default class Cipher {
  encrypt(plainText: string) {
    const utf8_plain = CryptoJS.enc.Utf8.parse(plainText);
    const encrypted = CryptoJS.AES.encrypt(utf8_plain, KEY).toString();
    return encrypted;
  }
  decrypt(encryptedText: string) {
    const decrypted = CryptoJS.AES.decrypt(encryptedText, KEY).toString(
      CryptoJS.enc.Utf8
    );
    return decrypted;
  }
}
