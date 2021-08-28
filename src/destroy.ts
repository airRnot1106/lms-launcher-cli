import fs from 'fs';
import readlineSync from 'readline-sync';
import chalk from 'chalk';
import { Cipher, Caution } from './index';

import { IFunc } from './iFunc';

export default class Destroy implements IFunc {
  private caution: Caution;
  private cipher: Cipher;
  constructor() {
    this.caution = new Caution();
    this.cipher = new Cipher();
    if (!fs.existsSync(__dirname + '/config.ini')) {
      this.caution.toString(new Error('Config file not found'));
    }
  }
  async excute() {
    const isDestroy = readlineSync.keyInYNStrict(
      chalk.yellow.bold('Do you want to delete config file?')
    );
    if (!isDestroy) {
      console.log('> Cancel deletion');
      process.exit(0);
    }
    fs.unlinkSync(__dirname + '/config.ini');
    console.log(chalk.magentaBright('> Completed deletion'));
  }
}
