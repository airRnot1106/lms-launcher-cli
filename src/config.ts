import fs from 'fs';
import propertiesReader from 'properties-reader';
import readlineSync from 'readline-sync';
import chalk from 'chalk';
import { Cipher, Caution } from './index';

import { IFunc } from './iFunc';

export default class Config implements IFunc {
  private caution: Caution;
  private cipher: Cipher;
  private _properties: propertiesReader.Reader;
  constructor() {
    this.caution = new Caution();
    this.cipher = new Cipher();
    if (!fs.existsSync(__dirname + '/config.ini')) {
      fs.writeFileSync(__dirname + '/config.ini', '');
      console.log(chalk.yellow('> Created Config file'));
    }
    this._properties = propertiesReader(__dirname + '/config.ini');
  }
  async excute() {
    console.log('Config: ');
    const username = readlineSync.question(chalk.bold('Enter your username: '));
    const password = readlineSync.questionNewPassword(
      chalk.bold('Enter your password: '),
      {
        min: 8,
        max: 14,
      }
    );
    const encryptedPassword = this.cipher.encrypt(password);
    this._properties.set('loginData.username', username);
    this._properties.set('loginData.password', encryptedPassword);
    await this._properties.save(__dirname + '/config.ini').then(
      (data) => {
        console.log(
          chalk.greenBright('Login data has been saved successfully')
        );
      },
      (error) => {
        this.caution.toString(new Error('Failed to save'), 'Fatal Error');
      }
    );
  }
}
