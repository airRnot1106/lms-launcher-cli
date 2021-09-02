import fs from 'fs';
import readlineSync from 'readline-sync';
import chalk from 'chalk';
import { Cipher, Caution, PropertiesReader } from '../index';

import { IFunc } from '../iFunc';

export default class Destroy implements IFunc {
  constructor() {
    PropertiesReader.initialize(false);
  }
  async excute() {
    this.destroy();
  }
  private destroy() {
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
