import readlineSync from 'readline-sync';
import chalk from 'chalk';
import { PropertiesReader } from '../index';
import { usernameAddress, passwordAddress } from '../static/propatiesReader';
import { IFunc } from '../iFunc';

export default class Config implements IFunc {
  constructor() {
    PropertiesReader.initialize(true);
  }
  async execute() {
    await this.configure();
  }
  private async configure() {
    console.log('> Config <');

    const username = readlineSync.question(chalk.bold('Enter your username: '));
    const password = readlineSync.questionNewPassword(
      chalk.bold('Enter your password: '),
      {
        min: 8,
        max: 14,
      }
    );
    await PropertiesReader.write(usernameAddress, username);
    await PropertiesReader.writeCipher(passwordAddress, password);
    console.log(chalk.greenBright('> Login data has been saved successfully'));
  }
}
