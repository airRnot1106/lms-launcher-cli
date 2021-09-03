import CryptoJS from 'crypto-js';

export default class Cipher {
  private static KEY = 'QVVUT19BVFRFTkRBTkNFX1JFQ09SREVS';
  static encrypt(plainText: string) {
    const utf8_plain = CryptoJS.enc.Utf8.parse(plainText);
    const encrypted = CryptoJS.AES.encrypt(utf8_plain, this.KEY).toString();
    return encrypted;
  }
  static decrypt(encryptedText: string) {
    const decrypted = CryptoJS.AES.decrypt(encryptedText, this.KEY).toString(
      CryptoJS.enc.Utf8
    );
    return decrypted;
  }
}
