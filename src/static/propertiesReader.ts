import fs from 'fs';
import propertiesReader from 'properties-reader';
import chalk from 'chalk';
import { Caution, Cipher } from '../index';

export type Ini = {
  section: string;
  key: string;
};

export const usernameAddress: Ini = {
  section: 'loginData',
  key: 'username',
};
export const passwordAddress: Ini = {
  section: 'loginData',
  key: 'password',
};

export default class PropertiesReader {
  private static _isValid = false;
  private static _properties: propertiesReader.Reader | undefined = undefined;
  static initialize(isAllowNotExists: boolean) {
    if (isAllowNotExists) {
      if (!fs.existsSync(__dirname + '/config.ini')) {
        fs.writeFileSync(__dirname + '/config.ini', '');
        console.log(chalk.yellow('> Created Config file'));
      }
    } else {
      if (!fs.existsSync(__dirname + '/config.ini')) {
        Caution.toString(
          new Error(
            'Config file not found. Please execute the config command first'
          )
        );
      }
    }
    this._properties = propertiesReader(__dirname + '/config.ini');
    this._isValid = true;
  }
  static async write(address: Ini, data: string) {
    if (!this._isValid) {
      Caution.toString(
        new Error('PropertiesReader is not initialized'),
        'Fatal Error'
      );
    }
    this._properties?.set(`${address.section}.${address.key}`, data);
    await this._properties?.save(__dirname + '/config.ini').then(
      (data) => {},
      (error) => {
        Caution.toString(new Error('Failed to save'), 'Fatal Error');
      }
    );
  }
  static async writeCipher(address: Ini, data: string) {
    if (!this._isValid) {
      Caution.toString(
        new Error('PropertiesReader is not initialized'),
        'Fatal Error'
      );
    }
    const encryptedString = Cipher.encrypt(data);
    this._properties?.set(`${address.section}.${address.key}`, encryptedString);
    await this._properties?.save(__dirname + '/config.ini').then(
      (data) => {},
      (error) => {
        Caution.toString(new Error('Failed to save'), 'Fatal Error');
      }
    );
  }
  static read(address: Ini) {
    if (!this._isValid) {
      Caution.toString(
        new Error('PropertiesReader is not initialized'),
        'Fatal Error'
      );
    }
    return <string>this._properties?.get(`${address.section}.${address.key}`);
  }
  static readCipher(address: Ini) {
    if (!this._isValid) {
      Caution.toString(
        new Error('PropertiesReader is not initialized'),
        'Fatal Error'
      );
    }
    const encryptedString = this.read(address);
    return Cipher.decrypt(encryptedString);
  }
}
